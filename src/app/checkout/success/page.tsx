import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { getLatestSubscriptionForTenant } from "@/lib/db/billing";
import { verifyCheckoutToken } from "@/lib/billing/checkout-token";
import { Card } from "@/components/ui/card";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { ActivationPoller } from "@/components/billing/ActivationPoller";

export const dynamic = "force-dynamic";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!session.tenantId) {
    redirect("/");
  }

  const params = await searchParams;
  const tenant = await getTenantByTenantId(session.tenantId);
  const subscription = await getLatestSubscriptionForTenant(tenant?.id ?? "");
  const ref = params.ref ?? null;
  const payload = ref ? verifyCheckoutToken(ref) : null;
  const isPremium = tenant?.plan === "premium";

  if (ref && !payload && !isPremium) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          <Card className="border border-border p-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              This link is invalid or expired
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your checkout session link is no longer valid. It may have expired or already been
              used.
            </p>
            <div className="mt-8 flex gap-3 justify-center">
              <Link
                href="/checkout?plan=premium"
                className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start a new checkout
              </Link>
              <Link
                href="/admin/billing"
                className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
              >
                View billing
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>

        <Card className="border border-border p-8 text-center">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl ${
              isPremium ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {isPremium ? "✓" : "⏳"}
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">
            {isPremium ? "Welcome to Premium!" : "Almost there…"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPremium
              ? "Your subscription is active."
              : "Your subscription is being activated. It usually takes a few seconds."}
          </p>

          <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-left">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Subscription details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">
                  {subscription?.plan === "premium" ? "Premium" : "Pending activation"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">{subscription?.status ?? "—"}</span>
              </div>
              {subscription?.currentPeriodEnd && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renews on</span>
                  <span className="font-medium text-foreground">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <ActivationPoller token={ref} initialPlan={tenant?.plan ?? "free"} />
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/admin/billing"
              className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View billing
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Go to admin
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
