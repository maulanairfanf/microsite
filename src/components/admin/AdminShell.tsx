"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { clientApi } from "@/lib/client-api";
import type { Role } from "@/lib/constants";
import { Plan } from "@/lib/constants";

interface AdminShellProps {
  role: Role;
  tenantName?: string;
  tenantPlan?: Plan;
  userName: string;
  userEmail: string;
  isImpersonating?: boolean;
  emailVerified?: boolean;
  children: React.ReactNode;
}

export function AdminShell({
  role,
  tenantName,
  tenantPlan = Plan.Free,
  userName,
  userEmail,
  isImpersonating = false,
  emailVerified = false,
  children,
}: AdminShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function handleResendEmail() {
    setResending(true);
    setResendMsg("");
    try {
      await clientApi.post("/api/auth/resend-verification", {});
      setResendMsg("Email sent! Check your inbox.");
    } catch (err: unknown) {
      setResendMsg(err instanceof Error ? err.message : "Failed to resend.");
    } finally {
      setResending(false);
    }
  }

  const showBanner = !emailVerified && !bannerDismissed;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role={role}
        tenantName={tenantName}
        tenantPlan={tenantPlan}
        userName={userName}
        userEmail={userEmail}
        isImpersonating={isImpersonating}
        mobileOpen={isMobileNavOpen}
        onMobileOpenChange={setIsMobileNavOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          role={role}
          userName={userName}
          userEmail={userEmail}
          isImpersonating={isImpersonating}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        {showBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Verify your email address</span>
                {" —"} check your inbox for a verification link. Unverified accounts may have limited features.
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend email"}
                </button>
                {resendMsg && (
                  <span className={`text-xs ${resendMsg.includes("sent") ? "text-green-700" : "text-amber-700"}`}>
                    {resendMsg}
                  </span>
                )}
                <Link
                  href="/verify-email"
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
                >
                  View status
                </Link>
              </div>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
