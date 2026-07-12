import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role, Plan } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { getActiveSubscriptionForTenant, getLatestSubscriptionForTenant, SubscriptionStatus } from "@/lib/db/billing";
import { PLANS } from "@/lib/billing/plans";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { SubscriptionCard } from "@/components/billing/SubscriptionCard";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!session.tenantId) {
    redirect("/");
  }
  if (session.role !== Role.TenantMainAdmin && session.role !== Role.TenantAdmin) {
    redirect("/admin");
  }

  const tenant = await getTenantByTenantId(session.tenantId);
  if (!tenant) {
    redirect("/admin");
  }

  const activeSubscription = await getActiveSubscriptionForTenant(tenant.id);
  const latestSubscription = await getLatestSubscriptionForTenant(tenant.id);
  const plan = tenant.plan === Plan.Premium ? PLANS[Plan.Premium] : PLANS[Plan.Free];
  const canceledAtDisplay = latestSubscription
    ? new Date(
        latestSubscription.canceledAt ?? latestSubscription.updatedAt ?? new Date(),
      ).toLocaleDateString()
    : "—";

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription and view payment history"
      />

      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {plan.price === 0
                ? "Free forever"
                : `Rp ${plan.price.toLocaleString("id-ID")} / ${plan.interval}`}
            </p>
          </div>
          {tenant.plan === Plan.Free ? (
            <CheckoutButton plan={Plan.Premium} className="bg-primary text-white">
              Upgrade to Premium
            </CheckoutButton>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Active
            </span>
          )}
        </div>
      </Card>

      {activeSubscription && <SubscriptionCard subscription={activeSubscription} />}

      {!activeSubscription && latestSubscription && latestSubscription.status === SubscriptionStatus.Canceled && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900">Previous subscription</h3>
          <p className="mt-1 text-sm text-gray-500">
            Canceled on {canceledAtDisplay}. You can re-subscribe anytime.
          </p>
          <div className="mt-4">
            <CheckoutButton plan={Plan.Premium} className="bg-primary text-white">
              Re-subscribe to Premium
            </CheckoutButton>
          </div>
        </Card>
      )}

      {tenant.plan === Plan.Free && !activeSubscription && !latestSubscription && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900">No subscription history</h3>
          <p className="mt-1 text-sm text-gray-500">
            You're on the free plan. Upgrade to unlock all themes, unlimited links, and priority support.
          </p>
          <div className="mt-4">
            <Link
              href="/checkout?plan=premium"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
            >
              See Premium plan
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
