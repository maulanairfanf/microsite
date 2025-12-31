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
    <main className="min-h-screen bg-gray-200 flex items-start justify-center py-0 md:pt-8">
      <div className="w-full max-w-md bg-gray-100 shadow-2xl md:rounded-t-3xl overflow-hidden">
        {components.map((component) => (
          <ComponentRenderer key={component.id} component={component} />
        ))}
      </div>
    </main>
  );
}
