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
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900">Subscriptions are tenant-only</h1>
          <p className="mt-2 text-sm text-gray-500">
            Only tenant admins can manage subscriptions. You're signed in as a {session.role.replace("_", " ")}.
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-900">Subscribe to {plan.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            You'll be redirected to the secure payment page to complete your subscription.
          </p>

          {params.canceled && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
              Checkout was canceled. You can try again whenever you're ready.
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order summary</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{plan.name} plan</p>
                <p className="text-xs text-gray-500">Billed monthly</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                Rp {plan.price.toLocaleString("id-ID")}
                <span className="text-xs text-gray-500 font-normal">/mo</span>
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
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
                    Set the{" "}
                    <code className="bg-amber-100 px-1 rounded">XENDIT_SECRET_KEY</code> and{" "}
                    <code className="bg-amber-100 px-1 rounded">XENDIT_CALLBACK_TOKEN</code>{" "}
                    env vars. See the README for setup instructions.
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

          <p className="mt-6 text-xs text-gray-500 text-center">
            Cancel anytime. Secure payment processing.
            <br />
            Test mode: use any Indonesian e-wallet (GoPay, OVO, DANA) or QRIS — all complete automatically.
          </p>
        </Card>
      </div>
    </div>
  );
}
