import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Showcase } from "@/components/landing/Showcase";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA, Footer } from "@/components/landing/Footer";
import { NavBarWithScrollSpy } from "@/components/landing/NavBar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavBarWithScrollSpy />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
