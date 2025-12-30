export interface CTA {
  text: string;
  url: string;
}

export interface HeroComponent {
  id: string;
  type: "hero";
  title: string;
  subtitle: string;
  image: string;
  logo?: string;
  cta: CTA;
}

export interface LinkItem {
  text: string;
  url: string;
}

export interface LinktreeComponent {
  id: string;
  type: "linktree";
  title: string;
  items: LinkItem[];
}

export interface ProductItem {
  id: string;
  title: string;
  image: string;
  price: string;
  url: string;
}

export interface ProductCatalogComponent {
  id: string;
  type: "product_catalog";
  title: string;
  items: ProductItem[];
}

export type Component = HeroComponent | LinktreeComponent | ProductCatalogComponent;

export interface ComponentsData {
  components: Component[];
}
