import { HeroComponent, LinktreeComponent, ProductsShowcaseComponent, ProductsCatalogComponent } from "@/types/components";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import heroData from "@/data/hero.json";
import linktreeData from "@/data/linktree.json";
import showcaseData from "@/data/products_showcase.json";
import catalogData from "@/data/products_catalog.json";

export default function Home() {
  const hero = heroData as HeroComponent;
  const linktree = linktreeData as LinktreeComponent;
  const showcase = showcaseData as ProductsShowcaseComponent;
  const catalog = catalogData as ProductsCatalogComponent;

  const components = [hero, linktree, showcase, catalog];

  return (
    <main className="w-full">
      {components.map((component) => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
    </main>
  );
}
