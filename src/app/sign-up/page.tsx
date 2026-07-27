"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIsClient } from "@/lib/useIsClient";
import { SLUG_REGEX } from "@/lib/slug";
import { FormField } from "@/components/auth/FormField";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const router = useRouter();
  const mounted = useIsClient();
  const [tenantId, setTenantId] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedSlug = tenantId.trim().toLowerCase();
  const slugValid =
    !tenantId || (SLUG_REGEX.test(normalizedSlug) && normalizedSlug.length >= 3);

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
      setError(
        "Tenant ID must be 3-40 chars, lowercase letters, numbers, or dashes",
      );
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Bright gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
        }}
      />

      {/* Bright floating orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-300 rounded-full blur-[120px] opacity-70 animate-float" />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-pink-300 rounded-full blur-[150px] opacity-70 animate-float-delayed" />
      <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-cyan-300 rounded-full blur-[100px] opacity-70 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-300 rounded-full blur-[80px] opacity-60 animate-float delay-300" />

      {/* Decorative floating shapes */}
      <div className="absolute top-[15%] left-[5%] w-16 h-16 border-4 border-white/40 rounded-2xl rotate-12 animate-float hidden md:block" />
      <div className="absolute bottom-[25%] right-[8%] w-12 h-12 bg-yellow-300 rounded-full opacity-80 animate-bounce-in delay-200 hidden md:block" />
      <div className="absolute top-[60%] left-[8%] w-8 h-8 bg-cyan-300 rounded-full opacity-70 animate-float-delayed delay-300 hidden md:block" />

      {/* Card + mockup row */}
      <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-12 items-center max-w-5xl w-full">
        {/* Sign-up card */}
        <div
          className={`w-full max-w-md mx-auto bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex justify-center mb-5">
            <BrandLogo />
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-md mb-4">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
              <span className="text-white text-xs font-semibold">Free to start</span>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Create your <span className="text-yellow-300">Halamanku</span>
            </h1>
            <p className="text-white/90 mt-2 text-sm">No credit card required</p>
          </div>

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
              error={
                tenantId && !slugValid
                  ? "3-40 chars, lowercase, numbers, or dashes"
                  : undefined
              }
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
              <div className="p-3 bg-red-500/20 backdrop-blur border border-red-300/40 text-white text-sm rounded-xl">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading || !slugValid}
              disabled={!slugValid}
              className="w-full px-6 py-3.5 bg-yellow-400 text-purple-700 rounded-xl font-bold text-base hover:bg-yellow-300 shadow-xl transition-all hover:scale-[1.02]"
            >
              Create my page
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-yellow-300 hover:text-yellow-200 underline font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Phone mockup - decorative */}
        <div
          className={`hidden lg:flex justify-center transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="phone-mockup w-[280px] animate-float shadow-2xl">
            <div className="phone-screen p-5">
              <div className="text-center text-white">
                <div className="w-14 h-14 mx-auto bg-white/30 rounded-full mb-3 backdrop-blur" />
                <h3 className="font-bold text-base drop-shadow">Your Brand</h3>
                <p className="text-xs text-white/80">@yourname</p>
              </div>
              <div className="mt-5 space-y-2.5">
                {["Instagram", "YouTube", "Shopee", "WhatsApp"].map((item, i) => (
                  <div
                    key={item}
                    className="bg-white/25 backdrop-blur rounded-xl p-2.5 text-white text-sm font-semibold text-center hover:bg-white/40 transition-all"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
