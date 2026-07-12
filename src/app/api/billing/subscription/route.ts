import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { getActiveSubscriptionForTenant } from "@/lib/db/billing";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.tenantId) {
    return NextResponse.json({ error: "No tenant associated with this account" }, { status: 400 });
  }

  const tenant = await getTenantByTenantId(session.tenantId);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const subscription = await getActiveSubscriptionForTenant(tenant.id);

  return NextResponse.json({
    data: {
      plan: tenant.plan,
      subscription,
    },
  });
}
