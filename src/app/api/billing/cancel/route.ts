import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
import {
  getActiveSubscriptionForTenant,
  updateSubscriptionStatus,
  SubscriptionStatus,
} from "@/lib/db/billing";

export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== Role.TenantMainAdmin && session.role !== Role.TenantAdmin) {
      return NextResponse.json(
        { error: "Only tenant admins can cancel subscriptions" },
        { status: 403 },
      );
    }
    if (!session.tenantId) {
      return NextResponse.json({ error: "No tenant associated with this account" }, { status: 400 });
    }

    const tenant = await getTenantByTenantId(session.tenantId);
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const subscription = await getActiveSubscriptionForTenant(tenant.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription to cancel" },
        { status: 404 },
      );
    }

    await updateSubscriptionStatus(subscription.xenditInvoiceId ?? subscription.id, {
      status: SubscriptionStatus.Canceled,
      canceledAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Subscription canceled" });
  } catch (error) {
    console.error("POST /api/billing/cancel error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
