"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import { Plan } from "@/lib/constants";

interface CheckoutButtonProps {
  plan: typeof Plan.Premium;
  className?: string;
  children?: React.ReactNode;
}

interface CheckoutResponse {
  data: { url: string; sessionId: string };
}

export function CheckoutButton({ plan, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await clientApi.post<CheckoutResponse>("/api/billing/checkout", { plan });
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      setError("Checkout did not return a URL");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          children ?? "Subscribe"
        )}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
