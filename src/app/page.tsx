import { getSession } from "@/lib/auth";
import { listLandingTenants } from "@/lib/db/tenants";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Showcase } from "@/components/landing/Showcase";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA, Footer } from "@/components/landing/Footer";
import { NavBarWithScrollSpy, type NavBarSession } from "@/components/landing/NavBar";

export default async function HomePage() {
  const session = await getSession();
  const navSession: NavBarSession = {
    isLoggedIn: !!session,
    role: session?.role ?? null,
  };

  const showcaseTenants = await listLandingTenants();

  return (
    <div className="min-h-screen">
      <NavBarWithScrollSpy session={navSession} />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase tenants={showcaseTenants} />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
