"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { SubscriptionWithPayments } from "@/lib/db/billing";

interface SubscriptionCardProps {
  subscription: SubscriptionWithPayments;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  past_due: "bg-amber-100 text-amber-700",
  canceled: "bg-gray-100 text-gray-600",
  unpaid: "bg-red-100 text-red-700",
  trialing: "bg-blue-100 text-blue-700",
};

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / (currency === "IDR" ? 1 : 100));
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!window.confirm("Cancel your Premium subscription? You'll keep access until the end of the current billing period.")) {
      return;
    }
    setError(null);
    setCancelling(true);
    try {
      await clientApi.post("/api/billing/cancel", {});
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel");
      setCancelling(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Premium subscription</h3>
          <p className="mt-1 text-sm text-gray-500">
            Started {formatDate(subscription.startedAt)} · Renews {formatDate(subscription.currentPeriodEnd)}
          </p>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${STATUS_COLORS[subscription.status] || "bg-gray-100 text-gray-600"}`}
        >
          {subscription.status}
        </span>
      </div>

      {subscription.payments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment history</h4>
          <div className="space-y-2">
            {subscription.payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {formatAmount(p.amount, p.currency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(p.createdAt)} · {p.method}
                    {p.cardLast4 ? ` · ···· ${p.cardLast4}` : ""}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    p.status === "succeeded"
                      ? "bg-green-100 text-green-700"
                      : p.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subscription.status === "active" && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              "Cancel subscription"
            )}
          </Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </Card>
  );
}
