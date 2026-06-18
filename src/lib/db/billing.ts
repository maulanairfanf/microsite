import { prisma } from "@/lib/prisma";

export const SubscriptionStatus = {
  Active: "active",
  Canceled: "canceled",
  PastDue: "past_due",
  Expired: "expired",
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface SubscriptionWithPayments {
  id: string;
  tenantId: string;
  plan: string;
  status: string;
  startedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt: Date | null;
  xenditInvoiceId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    transactionId: string;
    cardLast4: string | null;
    cardBrand: string | null;
    failureReason: string | null;
    createdAt: Date;
  }>;
}

export async function getActiveSubscriptionForTenant(
  tenantId: string,
): Promise<SubscriptionWithPayments | null> {
  const sub = await prisma.subscription.findFirst({
    where: { tenantId, status: SubscriptionStatus.Active },
    orderBy: { createdAt: "desc" },
    include: {
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
  return sub as SubscriptionWithPayments | null;
}

export async function getLatestSubscriptionForTenant(
  tenantId: string,
): Promise<SubscriptionWithPayments | null> {
  const sub = await prisma.subscription.findFirst({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
  return sub as SubscriptionWithPayments | null;
}

export async function getSubscriptionByXenditInvoiceId(
  xenditInvoiceId: string,
): Promise<SubscriptionWithPayments | null> {
  const sub = await prisma.subscription.findUnique({
    where: { xenditInvoiceId },
    include: {
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
  return sub as SubscriptionWithPayments | null;
}

export async function recordSubscription(data: {
  tenantId: string;
  plan: string;
  status: string;
  xenditInvoiceId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  return prisma.subscription.create({
    data: {
      tenantId: data.tenantId,
      plan: data.plan,
      status: data.status,
      xenditInvoiceId: data.xenditInvoiceId ?? null,
      currentPeriodStart: data.currentPeriodStart ?? new Date(),
      currentPeriodEnd:
        data.currentPeriodEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

export async function updateSubscriptionStatus(
  xenditInvoiceId: string,
  data: { status?: string; canceledAt?: Date | null; currentPeriodEnd?: Date },
) {
  return prisma.subscription.update({
    where: { xenditInvoiceId },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.canceledAt !== undefined && { canceledAt: data.canceledAt }),
      ...(data.currentPeriodEnd !== undefined && {
        currentPeriodEnd: data.currentPeriodEnd,
      }),
      updatedAt: new Date(),
    },
  });
}

export async function setTenantPlan(tenantId: string, plan: "free" | "premium") {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: { plan, updatedAt: new Date() },
  });
}

export async function recordPayment(data: {
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  transactionId: string;
  cardLast4?: string | null;
  cardBrand?: string | null;
  failureReason?: string | null;
}) {
  return prisma.payment.create({
    data: {
      subscriptionId: data.subscriptionId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      method: data.method,
      transactionId: data.transactionId,
      cardLast4: data.cardLast4 ?? null,
      cardBrand: data.cardBrand ?? null,
      failureReason: data.failureReason ?? null,
    },
  });
}
