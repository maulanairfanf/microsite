"use client"; // Polling requires browser timers + router.refresh

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import { RefreshStatus } from "@/lib/billing/refresh-status";

interface RefreshResponse {
  data: { status: RefreshStatus; alreadyActive?: boolean };
}

interface ActivationPollerProps {
  token: string | null;
  initialPlan: string;
}

const PollerState = {
  Polling: "polling",
  Active: "active",
  Expired: "expired",
  NotFound: "not_found",
} as const;
type PollerState = (typeof PollerState)[keyof typeof PollerState];

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15;

export function ActivationPoller({ token, initialPlan }: ActivationPollerProps) {
  const router = useRouter();
  const [state, setState] = useState<PollerState>(
    initialPlan === "premium" ? PollerState.Active : token ? PollerState.Polling : PollerState.NotFound,
  );
  const stateRef = useRef<PollerState>(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (!token) return;
    if (stateRef.current !== PollerState.Polling) return;

    let cancelled = false;
    const pollsRef = { count: 0 };

    async function callRefresh(simulate: boolean): Promise<RefreshResponse["data"] | null> {
      try {
        const res = await clientApi.post<RefreshResponse>("/api/billing/refresh", {
          ref: token,
          simulate,
        });
        if (cancelled) return null;
        return res.data;
      } catch {
        return null;
      }
    }

    async function tick() {
      pollsRef.count += 1;

      let data = await callRefresh(false);
      if (!data) {
        if (pollsRef.count >= MAX_POLLS) setState(PollerState.Expired);
        return;
      }

      if (data.status === RefreshStatus.Pending) {
        data = await callRefresh(true);
        if (!data) {
          if (pollsRef.count >= MAX_POLLS) setState(PollerState.Expired);
          return;
        }
      }

      if (cancelled) return;

      if (data.status === RefreshStatus.Active) {
        setState(PollerState.Active);
        router.refresh();
        return;
      }
      if (data.status === RefreshStatus.Expired) {
        setState(PollerState.Expired);
        return;
      }
      if (data.status === RefreshStatus.NotFound) {
        setState(PollerState.NotFound);
        return;
      }
      if (pollsRef.count >= MAX_POLLS) {
        setState(PollerState.Expired);
      }
    }

    void tick();
    const interval = setInterval(() => {
      if (cancelled) return;
      if (pollsRef.count >= MAX_POLLS) {
        clearInterval(interval);
        return;
      }
      void tick();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, router]);

  if (state === PollerState.Active) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Subscription activated. Refreshing…
      </p>
    );
  }

  if (state === PollerState.Expired) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-amber-700">
          This checkout session has expired. Please start a new one to subscribe.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/checkout?plan=premium">Start new checkout</Link>
        </Button>
      </div>
    );
  }

  if (state === PollerState.NotFound) {
    return (
      <p className="text-sm text-gray-500">
        We can't find this checkout session. If you completed payment, please start a new checkout.
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      Waiting for payment confirmation…
    </p>
  );
}
