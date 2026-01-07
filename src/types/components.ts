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
  products: ProductItem[];
}

export interface ProductsCatalogComponent {
  id: string;
  type: "products_catalog";
  title: string;
  categories: CategoryItem[];
}

export interface BannerItem {
  id: string;
  section_id: string;
  image_url: string;
  cta: CTA;
}

export interface BannerComponent {
  id: string;
  title: string;
  type: "banner";
  data: BannerItem[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface FooterComponent {
  id: string;
  type: "footer";
  socialMedia: SocialLink[];
  joinButton: {
    text: string;
    url: string;
  };
  footerLinks: FooterLink[];
}

export interface SocialMediaComponent {
  id: string;
  type: "social_media";
  socialMedia: SocialLink[];
  joinButton?: {
    text: string;
    url: string;
  };
  footerLinks?: FooterLink[];
}

export type Component =
  | HeroComponent
  | LinktreeComponent
  | ProductsShowcaseComponent
  | ProductsCatalogComponent
  | BannerComponent
  | FooterComponent
  | SocialMediaComponent;

export interface ComponentsData {
  components: Component[];
}
