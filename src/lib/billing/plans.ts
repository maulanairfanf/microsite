import { Plan } from "@/lib/constants";

export interface PlanInfo {
  id: Plan;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "forever";
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  gradient: string;
  icon: string;
}

export const PLANS: Record<Plan, PlanInfo> = {
  [Plan.Free]: {
    id: Plan.Free,
    name: "Free",
    price: 0,
    currency: "IDR",
    interval: "forever",
    features: [
      "1 Microsite",
      "3 Links",
      "3 Themes",
      "Basic Sections",
    ],
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    highlighted: false,
    gradient: "from-gray-400 to-gray-500",
    icon: "🌱",
  },
  [Plan.Premium]: {
    id: Plan.Premium,
    name: "Premium",
    price: 30000,
    currency: "IDR",
    interval: "month",
    features: [
      "1 Microsite",
      "Unlimited Links",
      "All Themes",
      "Premium Sections",
      "Priority Support",
    ],
    cta: "Subscribe",
    ctaHref: "/checkout?plan=premium",
    highlighted: true,
    gradient: "from-violet-500 via-pink-500 to-orange-500",
    icon: "⭐",
  },
};
