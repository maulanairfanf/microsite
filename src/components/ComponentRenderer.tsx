import { Component } from "@/types/components";
import { Hero } from "./Hero";
import { Linktree } from "./Linktree";
import { ProductsShowcase } from "./ProductsShowcase";
import { ProductsCatalog } from "./ProductsCatalog";
import { Banner } from "./Banner";

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
    default:
      return null;
  }
}
