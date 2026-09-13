import { prisma } from "@/lib/prisma";
import {
  recordPayment,
  recordSubscription,
  setTenantPlan,
  updateSubscriptionStatus,
  getSubscriptionByXenditInvoiceId,
} from "@/lib/db/billing";
import { type XenditInvoiceStatus } from "@/lib/billing/providers/xendit";
import { Plan } from "@/lib/constants";
import { SubscriptionStatus } from "@/lib/db/billing";

export const ActivationKind = {
  Activated: "activated",
  AlreadyActive: "already_active",
  NoInvoice: "no_invoice",
  SkippedNotPaid: "skipped_not_paid",
} as const;
export type ActivationKind = (typeof ActivationKind)[keyof typeof ActivationKind];

export type ActivationOutcome =
  | { kind: typeof ActivationKind.Activated; subscriptionId: string }
  | { kind: typeof ActivationKind.AlreadyActive; subscriptionId: string }
  | { kind: typeof ActivationKind.NoInvoice }
  | { kind: typeof ActivationKind.SkippedNotPaid; status: XenditInvoiceStatus };

export interface ActivationInput {
  tenantId: string;
  xenditInvoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  paymentChannel: string | null;
  transactionId: string;
}

/**
 * Idempotent: if a Subscription row already exists for this Xendit invoice
 * (in any state), we update it rather than inserting a duplicate.
 * Called by both the Xendit webhook AND the /api/billing/refresh rescue endpoint.
 */
export async function activatePremiumSubscription(
  input: ActivationInput,
): Promise<ActivationOutcome> {
  const existing = await getSubscriptionByXenditInvoiceId(input.xenditInvoiceId);
  if (existing && existing.status === SubscriptionStatus.Active) {
    return { kind: ActivationKind.AlreadyActive, subscriptionId: existing.id };
  }

  if (existing) {
    return prisma.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { xenditInvoiceId: input.xenditInvoiceId },
        data: { status: SubscriptionStatus.Active, updatedAt: new Date() },
      });
      await tx.payment.create({
        data: {
          subscriptionId: existing.id,
          amount: input.amount,
          currency: input.currency,
          status: "succeeded",
          method: input.paymentMethod ?? input.paymentChannel ?? "xendit",
          transactionId: input.transactionId,
          cardLast4: null,
          cardBrand: null,
        },
      });
      await tx.tenant.update({
        where: { id: input.tenantId },
        data: { plan: Plan.Premium, updatedAt: new Date() },
      });
      return { kind: ActivationKind.Activated, subscriptionId: existing.id };
    });
  }

  return prisma.$transaction(async (tx) => {
    const sub = await tx.subscription.create({
      data: {
        tenantId: input.tenantId,
        plan: Plan.Premium,
        status: SubscriptionStatus.Active,
        xenditInvoiceId: input.xenditInvoiceId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    await tx.payment.create({
      data: {
        subscriptionId: sub.id,
        amount: input.amount,
        currency: input.currency,
        status: "succeeded",
        method: input.paymentMethod ?? input.paymentChannel ?? "xendit",
        transactionId: input.transactionId,
        cardLast4: null,
        cardBrand: null,
      },
    });
    await tx.tenant.update({
      where: { id: input.tenantId },
      data: { plan: Plan.Premium, updatedAt: new Date() },
    });
    return { kind: ActivationKind.Activated, subscriptionId: sub.id };
  });
}

export interface FailureInput {
  tenantId: string;
  xenditInvoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  transactionId: string;
  reason: string;
}

/** Idempotent failure recorder. Never touches Tenant.plan. */
export async function recordFailedPayment(input: FailureInput): Promise<void> {
  const existing = await getSubscriptionByXenditInvoiceId(input.xenditInvoiceId);
  if (existing) {
    await recordPayment({
      subscriptionId: existing.id,
      amount: input.amount,
      currency: input.currency,
      status: "failed",
      method: input.paymentMethod ?? "xendit",
      transactionId: input.transactionId,
      cardLast4: null,
      cardBrand: null,
      failureReason: input.reason,
    });
    return;
  }

  const sub = await recordSubscription({
    tenantId: input.tenantId,
    plan: Plan.Premium,
    status: SubscriptionStatus.Expired,
    xenditInvoiceId: input.xenditInvoiceId,
  });
  await recordPayment({
    subscriptionId: sub.id,
    amount: input.amount,
    currency: input.currency,
    status: "failed",
    method: input.paymentMethod ?? "xendit",
    transactionId: input.transactionId,
    cardLast4: null,
    cardBrand: null,
    failureReason: input.reason,
  });
}
