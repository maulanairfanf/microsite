import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { isBillingConfigured } from "@/lib/billing";
import { PLANS } from "@/lib/billing/plans";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { BrandLogo } from "@/components/auth/BrandLogo";

export const dynamic = "force-dynamic";

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string; canceled?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-up?next=/checkout?plan=premium");
  }
  if (session.role !== "tenant_main_admin" && session.role !== "tenant_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md border border-border p-8 text-center">
          <h1 className="text-xl font-semibold text-foreground">Subscriptions are tenant-only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only tenant admins can manage subscriptions. You're signed in as a{" "}
            {session.role.replace("_", " ")}.
          </p>
        </Card>
      </div>
    );
  }

  const params = await searchParams;
  const planId = (params.plan === "premium" ? "premium" : "premium") as "premium";
  const plan = PLANS[planId];
  const billingReady = isBillingConfigured();

  if (session.tenantId) {
    const tenant = await getTenantByTenantId(session.tenantId);
    if (tenant?.plan === "premium") {
      redirect("/admin/billing");
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>

        <Card className="border border-border p-8">
          <h1 className="text-2xl font-semibold text-foreground">Subscribe to {plan.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You'll be redirected to the secure payment page to complete your subscription.
          </p>

          {params.canceled && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
              Checkout was canceled. You can try again whenever you're ready.
            </div>
          )}

          <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Order summary</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{plan.name} plan</p>
                <p className="text-xs text-muted-foreground">Billed monthly</p>
              </div>
              <p className="text-lg font-semibold text-foreground">
                Rp {plan.price.toLocaleString("id-ID")}
                <span className="text-xs font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-green-500 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {billingReady ? (
              <CheckoutButton plan={planId} className="w-full">
                Continue to checkout
              </CheckoutButton>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
                  <p className="font-semibold">Billing is not configured</p>
                  <p className="mt-1 text-xs">
                    Set the <code className="bg-amber-100 px-1 rounded">XENDIT_SECRET_KEY</code> and{" "}
                    <code className="bg-amber-100 px-1 rounded">XENDIT_CALLBACK_TOKEN</code> env
                    vars. See the README for setup instructions.
                  </p>
                </div>
                <Link
                  href="/admin/billing"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  Back to billing
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Cancel anytime. Secure payment processing.
            <br />
            Test mode: use any Indonesian e-wallet (GoPay, OVO, DANA) or QRIS — all complete
            automatically.
          </p>
        </Card>
      </div>
    </div>
  );
}
