import { HeroComponent, LinktreeComponent, ProductsShowcaseComponent, ProductsCatalogComponent, BannerComponent, FooterComponent } from "@/types/components";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import heroData from "@/data/hero.json";
import linktreeData from "@/data/linktree.json";
import showcaseData from "@/data/products_showcase.json";
import catalogData from "@/data/products_catalog.json";
import bannerData from "@/data/banner.json";
import footerData from "@/data/footer.json";

export default function Home() {
  const hero = heroData as HeroComponent;
  const linktree = linktreeData as LinktreeComponent;
  const showcase = showcaseData as ProductsShowcaseComponent;
  const catalog = catalogData as ProductsCatalogComponent;
  const banner = bannerData as BannerComponent;
  const footer = footerData as FooterComponent;

  const components = [hero, banner, linktree, showcase, catalog, footer];

  return (
    <main className="min-h-screen bg-gray-200 flex items-start justify-center py-0 md:pt-8">
      <div className="w-full max-w-lg bg-gray-100 shadow-2xl md:rounded-t-3xl overflow-hidden">
        {components.map((component) => (
          <ComponentRenderer key={component.id} component={component} />
        ))}
      </div>
    </main>
  );
}
