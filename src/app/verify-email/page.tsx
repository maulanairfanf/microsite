"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { clientApi } from "@/lib/client-api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reason = searchParams.get("reason");

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const isSuccess = status === "success";

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>

        <div className="text-center mb-8">
          {isSuccess ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-foreground">Email Verified!</h1>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified. You now have full access to your
                Halamanku account.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-foreground">Verification Failed</h1>
              <p className="text-sm text-muted-foreground">
                {reason === "missing" &&
                  "No verification token was provided. Please use the link from your email."}
                {reason === "invalid" &&
                  "This link has expired or is invalid. Please request a new one below."}
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
              className="block w-full rounded-xl bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend Verification Email"}
            </button>

            {resendMessage && (
              <p
                className={`text-center text-sm ${resendMessage.includes("sent") ? "text-green-700" : "text-amber-700"}`}
              >
                {resendMessage}
              </p>
            )}

            <Link
              href="/admin"
              className="block w-full px-6 py-3 text-center text-sm text-muted-foreground hover:text-foreground"
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
