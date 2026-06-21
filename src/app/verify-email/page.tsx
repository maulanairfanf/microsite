"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { clientApi } from "@/lib/client-api";
import { useIsClient } from "@/lib/useIsClient";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const mounted = useIsClient();
  const status = searchParams.get("status");
  const reason = searchParams.get("reason");

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const isSuccess = status === "success";
  const isError = status === "error";

  async function handleResend() {
    setResending(true);
    setResendMessage("");
    try {
      await clientApi.post("/api/auth/resend-verification", {});
      setResendMessage("Verification email sent! Check your inbox.");
    } catch (err: unknown) {
      setResendMessage(err instanceof Error ? err.message : "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
        }}
      />

      <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-300 rounded-full blur-[120px] opacity-70 animate-float" />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-pink-300 rounded-full blur-[150px] opacity-70 animate-float-delayed" />
      <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-cyan-300 rounded-full blur-[100px] opacity-70 animate-pulse-glow" />

      <div
        className={`w-full max-w-md bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>

        <div className="text-center mb-8">
          {isSuccess ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                Email Verified!
              </h1>
              <p className="text-white/90 text-sm">
                Your email has been successfully verified. You now have full access to your Halamanku account.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                Verification Failed
              </h1>
              <p className="text-white/90 text-sm">
                {reason === "missing" && "No verification token was provided. Please use the link from your email."}
                {reason === "invalid" && "This link has expired or is invalid. Please request a new one below."}
                {reason === "server" && "Something went wrong on our end. Please try again."}
                {!reason && "An unexpected error occurred."}
              </p>
            </>
          )}
        </div>

        {isSuccess ? (
          <div className="space-y-3">
            <Link
              href="/admin"
              className="block w-full text-center px-6 py-3.5 bg-yellow-400 text-purple-700 rounded-xl font-bold hover:bg-yellow-300 shadow-xl transition-all hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full text-center px-6 py-3 text-white/90 hover:text-white underline text-sm transition-colors"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full px-6 py-3.5 bg-yellow-400 text-purple-700 rounded-xl font-bold hover:bg-yellow-300 shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {resending ? "Sending..." : "Resend Verification Email"}
            </button>

            {resendMessage && (
              <p className={`text-sm text-center ${resendMessage.includes("sent") ? "text-green-200" : "text-amber-200"}`}>
                {resendMessage}
              </p>
            )}

            <Link
              href="/admin"
              className="block w-full text-center px-6 py-3 text-white/90 hover:text-white underline text-sm transition-colors"
            >
              Maybe later — go to dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500" />
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
