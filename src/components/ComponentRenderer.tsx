import { Component } from "@/types/components";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./Hero").then((mod) => ({ default: mod.Hero })), {
  ssr: true,
});
const Linktree = dynamic(() => import("./Linktree").then((mod) => ({ default: mod.Linktree })), {
  ssr: true,
});
const ProductsShowcase = dynamic(
  () => import("./ProductsShowcase").then((mod) => ({ default: mod.ProductsShowcase })),
  { ssr: true },
);
const ProductsCatalog = dynamic(
  () => import("./ProductsCatalog").then((mod) => ({ default: mod.ProductsCatalog })),
  { ssr: true },
);
const Banner = dynamic(() => import("./Banner").then((mod) => ({ default: mod.Banner })), {
  ssr: true,
});
const Footer = dynamic(() => import("./Footer").then((mod) => ({ default: mod.Footer })), {
  ssr: true,
});
const SocialMedia = dynamic(
  () => import("./SocialMedia").then((mod) => ({ default: mod.SocialMedia })),
  { ssr: true },
);

export function ComponentRenderer({ component }: { component: Component }) {
  switch (component.type) {
    case "hero":
      return <Hero data={component} />;
    case "linktree":
      return <Linktree data={component} />;
    case "products_showcase":
      return <ProductsShowcase data={component} />;
    case "products_catalog":
      return <ProductsCatalog data={component} />;
    case "banner":
      return <Banner data={component} />;
    case "social_media":
      return <SocialMedia links={component.socialMedia} />;
    case "footer":
      return <Footer {...component} />;
    default:
      return null;
  }
}
