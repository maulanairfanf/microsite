import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Plan, Role } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { createCheckoutSession, isBillingConfigured } from "@/lib/billing";
import { PLANS } from "@/lib/billing/plans";
import { signCheckoutToken } from "@/lib/billing/checkout-token";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in to subscribe" }, { status: 401 });
    }
    if (session.role !== Role.TenantMainAdmin && session.role !== Role.TenantAdmin) {
      return NextResponse.json(
        { error: "Only tenant admins can manage subscriptions" },
        { status: 403 },
      );
    }

    if (!isBillingConfigured()) {
      return NextResponse.json(
        {
          error:
            "Billing is not configured. Set XENDIT_SECRET_KEY and XENDIT_CALLBACK_TOKEN in your .env (see README).",
        },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const planId = body?.plan ?? Plan.Premium;
    if (planId !== Plan.Premium) {
      return NextResponse.json(
        { error: `Unsupported plan: ${planId}. Use "${Plan.Premium}".` },
        { status: 400 },
      );
    }
    const plan = PLANS[Plan.Premium];

    if (!session.tenantId) {
      return NextResponse.json(
        { error: "No tenant associated with this account" },
        { status: 400 },
      );
    }
    const tenant = await getTenantByTenantId(session.tenantId);
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (tenant.plan === Plan.Premium) {
      return NextResponse.json({ error: "Tenant is already on the Premium plan" }, { status: 409 });
    }

    const origin =
      request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const externalId = `tenant-${tenant.id}-${Date.now()}`;

    const ref = signCheckoutToken(session.tenantId, externalId);

    const result = await createCheckoutSession({
      tenantId: tenant.id,
      externalId,
      tenantName: tenant.name,
      customerEmail: session.email,
      successUrl: `${origin}/checkout/success?ref=${ref}`,
      failureUrl: `${origin}/checkout?plan=premium&canceled=1`,
    });

    return NextResponse.json({
      data: {
        url: result.url,
        ...(ref ? { ref } : {}),
        plan,
      },
    });
  } catch (error) {
    console.error("POST /api/billing/checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
