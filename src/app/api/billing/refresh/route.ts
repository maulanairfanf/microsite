import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
import {
  findXenditInvoiceByExternalId,
  simulateXenditInvoicePayment,
  isBillingConfigured,
  XenditInvoiceStatus,
} from "@/lib/billing";
import { activatePremiumSubscription, ActivationKind } from "@/lib/billing/activation";
import { verifyCheckoutToken } from "@/lib/billing/checkout-token";
import { RefreshStatus } from "@/lib/billing/refresh-status";

interface RefreshBody {
  ref?: string;
  simulate?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
    }
    if (session.role !== Role.TenantMainAdmin && session.role !== Role.TenantAdmin) {
      return NextResponse.json(
        { error: "Only tenant admins can manage subscriptions" },
        { status: 403 },
      );
    }
    if (!session.tenantId) {
      return NextResponse.json(
        { error: "No tenant associated with this account" },
        { status: 400 },
      );
    }

    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured on this server" },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as RefreshBody;
    const ref = body.ref;
    const simulate = body.simulate === true;

    if (!ref) {
      return NextResponse.json({ error: "Missing ref" }, { status: 400 });
    }

    const record = verifyCheckoutToken(ref);
    if (!record) {
      return NextResponse.json({ data: { status: RefreshStatus.NotFound } });
    }

    if (record.tenantId !== session.tenantId) {
      return NextResponse.json(
        { error: "This invoice does not belong to your tenant" },
        { status: 403 },
      );
    }

    const tenant = await getTenantByTenantId(record.tenantId);
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (simulate && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Simulate is disabled in production" }, { status: 403 });
    }

    let invoice = await findXenditInvoiceByExternalId(record.externalId);
    if (!invoice) {
      return NextResponse.json({ data: { status: RefreshStatus.NotFound } });
    }

    if (invoice.status === XenditInvoiceStatus.Pending && simulate) {
      try {
        invoice = await simulateXenditInvoicePayment(record.externalId);
      } catch (err) {
        console.warn("simulate_payment failed (continuing):", err);
      }
    }

    if (invoice.status !== XenditInvoiceStatus.Paid) {
      let status: RefreshStatus;
      if (invoice.status === XenditInvoiceStatus.Expired) {
        status = RefreshStatus.Expired;
      } else if (invoice.status === XenditInvoiceStatus.Pending) {
        status = RefreshStatus.Pending;
      } else {
        status = RefreshStatus.Expired;
      }
      return NextResponse.json({ data: { status } });
    }

    const outcome = await activatePremiumSubscription({
      tenantId: tenant.id,
      xenditInvoiceId: invoice.id,
      amount: invoice.amount,
      currency: invoice.currency,
      paymentMethod: invoice.paymentMethod,
      paymentChannel: invoice.paymentChannel,
      transactionId: invoice.id,
    });

    if (outcome.kind === ActivationKind.AlreadyActive) {
      return NextResponse.json({
        data: { status: RefreshStatus.Active, alreadyActive: true },
      });
    }

    return NextResponse.json({
      data: { status: RefreshStatus.Active, alreadyActive: false },
    });
  } catch (error) {
    console.error("POST /api/billing/refresh error:", error);
    const message = error instanceof Error ? error.message : "Failed to refresh subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
