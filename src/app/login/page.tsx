"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/client-api";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await clientApi.post<{
        success: boolean;
        session: {
          role: "super_admin" | "tenant_main_admin" | "tenant_admin";
          tenantId?: string;
        };
      }>("/api/auth/login", { email, password });

      if (data.success) {
        if (data.session.role === "super_admin") {
          router.push("/super");
        } else {
          router.push("/admin");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" description="Sign in to manage your microsite.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="h-11 w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80">
          Create one
        </Link>
      </div>
    </AuthShell>
  );
}
