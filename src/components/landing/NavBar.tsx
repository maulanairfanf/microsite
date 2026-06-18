"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavBarVariant = "dark" | "light";
export type SessionRole = "super_admin" | "tenant_main_admin" | "tenant_admin" | null;

export interface NavBarSession {
  isLoggedIn: boolean;
  role: SessionRole;
}

function getAdminHref(session: NavBarSession): string {
  if (!session.isLoggedIn) return "/login";
  if (session.role === "super_admin") return "/super";
  return "/admin";
}

export function NavBar({
  variant = "dark",
  session,
}: {
  variant?: NavBarVariant;
  session: NavBarSession;
}) {
  const isLight = variant === "light";
  const isLoggedIn = session.isLoggedIn;
  const secondaryHref = getAdminHref(session);
  const secondaryLabel = isLoggedIn ? "Admin" : "Sign In";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-4 lg:px-8 transition-colors duration-300",
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
        <Link href="/" className="inline-flex items-center shrink-0" aria-label="Halamanku home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Halamanku"
            width={120}
            height={32}
            className={cn("h-8 w-auto transition-[filter,drop-shadow] duration-300")}
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={secondaryHref}
            className={cn(
              "font-medium px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300 hidden sm:inline-flex",
              isLight
                ? "text-gray-700 hover:text-gray-900 bg-white/70 border border-gray-200 hover:bg-white"
                : "text-white/90 hover:text-white bg-white/15 border border-white/20",
            )}
          >
            {secondaryLabel}
          </Link>
          <Link
            href={isLoggedIn ? "/admin" : "/sign-up"}
            className="cta-button px-6 py-2.5 bg-white text-purple-700 rounded-xl font-semibold hover:bg-yellow-300 transition-all"
          >
            {isLoggedIn ? "Open Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function NavBarWithScrollSpy({ session }: { session: NavBarSession }) {
  const [variant, setVariant] = useState<NavBarVariant>("dark");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-variant]"),
    );

    if (sections.length === 0) {
      setVariant("dark");
      return;
    }

    const isLightVariant = (el: HTMLElement): boolean =>
      el.getAttribute("data-nav-variant") === "light";

    const compute = () => {
      const viewportMid = window.innerHeight * 0.35;
      let bestEl: HTMLElement | null = null;
      let bestTop = Number.NEGATIVE_INFINITY;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        if (rect.top <= viewportMid && rect.top > bestTop) {
          bestTop = rect.top;
          bestEl = el;
        }
      }
      if (!bestEl) {
        const firstVisible = sections.find(
          (el) => el.getBoundingClientRect().bottom > 0,
        );
        bestEl = firstVisible ?? sections[0] ?? null;
      }
      if (bestEl) {
        setVariant(isLightVariant(bestEl) ? "light" : "dark");
      }
    };

    compute();

    const observer = new IntersectionObserver(compute, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0, 0.01, 0.1, 0.5, 1],
    });
    for (const el of sections) observer.observe(el);

    window.addEventListener("resize", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return <NavBar variant={variant} session={session} />;
}
