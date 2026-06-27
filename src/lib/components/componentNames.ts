export const ComponentName = {
  Hero: "hero",
  Banner: "banner",
  Linktree: "linktree",
  ProductsShowcase: "products_showcase",
  ProductsCatalog: "products_catalog",
  SocialMedia: "social_media",
  Footer: "footer",
} as const;
export type ComponentName = (typeof ComponentName)[keyof typeof ComponentName];
