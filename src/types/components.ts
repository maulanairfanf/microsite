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
  icon?: string;
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
  price: number;
  originalPrice?: number;
  discount?: string;
  url: string;
}

export interface ProductsShowcaseComponent {
  id: string;
  type: "products_showcase";
  title: string;
  items: ProductItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface ProductsCatalogComponent {
  id: string;
  type: "products_catalog";
  title: string;
  categories: CategoryItem[];
}

export type Component =
  | HeroComponent
  | LinktreeComponent
  | ProductsShowcaseComponent
  | ProductsCatalogComponent;

export interface ComponentsData {
  components: Component[];
}
