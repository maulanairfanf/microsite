"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SLUG_REGEX } from "@/lib/slug";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedSlug = tenantId.trim().toLowerCase();
  const slugValid = !tenantId || (SLUG_REGEX.test(normalizedSlug) && normalizedSlug.length >= 3);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (tenantName.trim().length < 2) {
      setError("Tenant name must be at least 2 characters");
      return;
    }

    if (!SLUG_REGEX.test(normalizedSlug)) {
      setError("Tenant ID must be 3-40 chars, lowercase letters, numbers, or dashes");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          tenantId: normalizedSlug,
          tenantName: tenantName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your page"
      description="Start with a free Halamanku microsite. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="tenantName"
          label="Brand name"
          value={tenantName}
          onChange={setTenantName}
          placeholder="My Awesome Brand"
          required
          minLength={2}
          maxLength={80}
          hint="The public name shown on your page"
        />

        <FormField
          id="tenantId"
          label="Tenant ID (URL slug)"
          value={tenantId}
          onChange={setTenantId}
          placeholder="my-brand"
          required
          minLength={3}
          maxLength={40}
          hint={`Your page will live at /${normalizedSlug || "your-id"}`}
          error={tenantId && !slugValid ? "3-40 chars, lowercase, numbers, or dashes" : undefined}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@email.com"
          required
          autoComplete="email"
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat your password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          loading={loading || !slugValid}
          disabled={!slugValid}
          className="h-11 w-full"
        >
          Create my page
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
