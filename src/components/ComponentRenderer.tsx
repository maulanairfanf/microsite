import { Component } from "@/types/components";
import { Hero } from "./Hero";
import { Linktree } from "./Linktree";
import { ProductCatalog } from "./ProductCatalog";

export function ComponentRenderer({ component }: { component: Component }) {
  switch (component.type) {
    case "hero":
      return <Hero data={component} />;
    case "linktree":
      return <Linktree data={component} />;
    case "product_catalog":
      return <ProductCatalog data={component} />;
    default:
      return null;
  }
}
