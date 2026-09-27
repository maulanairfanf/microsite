"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LayoutTemplate, Palette, PanelsTopLeft } from "lucide-react";
import { AppearanceToggle } from "@/components/AppearanceToggle";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import { parseThemeConfig, type ThemeConfigRecord } from "@/lib/themeConfig";
import type { Theme } from "@/types/components";

const blocks = [
  {
    icon: PanelsTopLeft,
    title: "Arrange your page",
    description: "Add, edit, and reorder the blocks visitors see.",
  },
  {
    icon: Palette,
    title: "Choose a direction",
    description: "Start with a clean theme, then make it yours.",
  },
  {
    icon: LayoutTemplate,
    title: "Share one link",
    description: "Keep your links, products, and updates in one place.",
  },
];

const plans = [
  {
    name: "Free",
    price: "Rp 0",
    detail: "Everything needed for one simple microsite.",
    items: ["1 microsite", "5 links", "3 themes", "Basic blocks"],
  },
  {
    name: "Premium",
    price: "Rp 30.000",
    detail: "More room to build a page that keeps growing.",
    items: ["1 microsite", "Unlimited links", "All themes", "Premium blocks"],
  },
];

interface LandingTenant {
  tenantId: string;
  name: string;
}

interface HalamankuLandingProps {
  landingTenants: LandingTenant[];
}

export function HalamankuLanding({ landingTenants }: HalamankuLandingProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [themeLoadError, setThemeLoadError] = useState(false);
  const heroPreviewRef = useRef<HTMLDivElement>(null);
  const selectedTheme = themes.find((theme) => theme.id === selectedThemeId) ?? themes[0];

  useEffect(() => {
    async function loadThemes() {
      try {
        const response = await clientApi.get<{ data: ThemeConfigRecord[] }>("/api/themes");
        const parsedThemes = response.data.slice(0, 4).map(parseThemeConfig);
        setThemes(parsedThemes);
        setSelectedThemeId(parsedThemes[0]?.id ?? "");
      } catch {
        setThemeLoadError(true);
      }
    }

    void loadThemes();
  }, []);

  function handlePreviewPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const preview = heroPreviewRef.current;
    if (!preview) return;
    const bounds = preview.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    preview.style.transform = `perspective(900px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) translate3d(${x * 6}px, ${y * 6}px, 0)`;
  }

  function resetPreviewPosition() {
    if (heroPreviewRef.current) {
      heroPreviewRef.current.style.transform = "";
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo />
          <div className="flex items-center gap-1 sm:gap-2">
            <AppearanceToggle className="hidden items-center sm:flex" />
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign in
            </Link>
            <Button asChild size="sm">
              <Link href="/sign-up">Create your page</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <p className="text-sm font-medium text-primary">Halamanku</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl">
            One simple page for everything you share.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Bring your links, products, and latest updates together in a page that feels like your
            own.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Create a free page <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#themes">Explore themes</Link>
            </Button>
          </div>
        </div>

        <div
          ref={heroPreviewRef}
          onPointerMove={handlePreviewPointerMove}
          onPointerLeave={resetPreviewPosition}
          className="mx-auto w-full max-w-sm rounded-[28px] border-8 border-foreground bg-background p-5 shadow-[0_18px_40px_rgb(23_23_23/0.14)] transition-transform duration-300 motion-reduce:transition-none"
        >
          <div className="mx-auto size-16 rounded-full bg-primary/10" />
          <p className="mt-4 text-center text-lg font-semibold">Studio Rupa</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Objects and ideas for everyday life.
          </p>
          <div className="mt-7 space-y-3">
            {["New collection", "Visit the studio", "Follow on Instagram"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium"
              >
                {label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden md:grid-cols-3">
          {blocks.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border-border p-7 md:border-r last:border-r-0">
              <Icon className="size-5 text-primary" />
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="themes" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary">Latest themes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Find a direction that fits.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Browse the four most recent themes. Each changes the surface, type, rhythm, and link
            treatment while keeping your content in focus.
          </p>
        </div>
        {selectedTheme && (
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  type="button"
                  variant="outline"
                  aria-pressed={selectedTheme.id === theme.id}
                  onClick={() => setSelectedThemeId(theme.id ?? "")}
                  className={`h-auto justify-start rounded-xl px-4 py-4 text-left ${selectedTheme.id === theme.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <span className="text-sm font-semibold">{theme.name}</span>
                </Button>
              ))}
            </div>
            <div
              className="mx-auto w-full max-w-sm border-8 border-foreground p-5 transition-[background-color,color,border-radius] duration-300"
              style={{
                backgroundColor: selectedTheme.theme.page.background,
                color: selectedTheme.theme.page.text,
                borderRadius: selectedTheme.theme.container.radius,
                fontFamily: selectedTheme.fontFamily,
              }}
            >
              <p className="text-center text-xs font-medium uppercase tracking-[0.16em] opacity-60">
                {selectedTheme.name}
              </p>
              <div className="mx-auto mt-4 size-16 rounded-full bg-primary/15" />
              <p className="mt-4 text-center text-lg font-semibold">Studio Rupa</p>
              <p className="mt-1 text-center text-sm opacity-70">
                Objects and ideas for everyday life.
              </p>
              <div className="mt-7 space-y-3">
                {["New collection", "Visit the studio", "Follow on Instagram"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border px-4 py-3.5 text-sm font-medium transition-colors duration-300"
                    style={{
                      backgroundColor: selectedTheme.theme.card.background,
                      borderColor: selectedTheme.theme.card.border,
                      borderRadius: selectedTheme.theme.card.radius,
                      color: selectedTheme.theme.card.text,
                    }}
                  >
                    {label}
                    <ArrowRight className="size-4 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!selectedTheme && (
          <p className="mt-10 text-sm text-muted-foreground">
            {themeLoadError ? "Themes are unavailable right now." : "Loading themes..."}
          </p>
        )}
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">Made with Halamanku</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Pages from our community.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Explore the public pages people have built with Halamanku.
            </p>
          </div>
          {landingTenants.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {landingTenants.map((tenant) => (
                <Link
                  key={tenant.tenantId}
                  href={`/${tenant.tenantId}`}
                  className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{tenant.name}</h3>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">View page</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-muted-foreground">
              Community pages will appear here soon.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-primary">Simple pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Start with what you need.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Every plan gives you a complete, usable microsite. Premium adds space and more ways to
              shape it.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <span className="text-lg font-semibold">
                    {plan.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      {plan.name === "Premium" ? "/month" : ""}
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.detail}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-7 w-full"
                  variant={plan.name === "Premium" ? "default" : "outline"}
                >
                  <Link href="/sign-up">
                    {plan.name === "Premium" ? "Choose Premium" : "Get started"}
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>Halamanku</span>
        <AppearanceToggle className="flex items-center sm:hidden" />
        <Link href="/sign-up" className="font-medium text-foreground hover:text-primary">
          Create your page
        </Link>
      </footer>
    </main>
  );
}
