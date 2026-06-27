import { HERO_SCHEMA } from "@/lib/components/schemas/hero";
import { BANNER_SCHEMA } from "@/lib/components/schemas/banner";
import { LINKTREE_SCHEMA } from "@/lib/components/schemas/linktree";
import { PRODUCTS_SHOWCASE_SCHEMA } from "@/lib/components/schemas/products-showcase";
import { PRODUCTS_CATALOG_SCHEMA } from "@/lib/components/schemas/products-catalog";
import { SOCIAL_MEDIA_SCHEMA } from "@/lib/components/schemas/social-media";
import { FOOTER_SCHEMA } from "@/lib/components/schemas/footer";
import { ComponentName } from "@/lib/components/componentNames";

export { HERO_SCHEMA } from "@/lib/components/schemas/hero";
export { BANNER_SCHEMA } from "@/lib/components/schemas/banner";
export { LINKTREE_SCHEMA } from "@/lib/components/schemas/linktree";
export { PRODUCTS_SHOWCASE_SCHEMA } from "@/lib/components/schemas/products-showcase";
export { PRODUCTS_CATALOG_SCHEMA } from "@/lib/components/schemas/products-catalog";
export { SOCIAL_MEDIA_SCHEMA } from "@/lib/components/schemas/social-media";
export { FOOTER_SCHEMA } from "@/lib/components/schemas/footer";

export const COMPONENT_SCHEMAS: Record<string, string> = {
  [ComponentName.Hero]: HERO_SCHEMA,
  [ComponentName.Banner]: BANNER_SCHEMA,
  [ComponentName.Linktree]: LINKTREE_SCHEMA,
  [ComponentName.ProductsShowcase]: PRODUCTS_SHOWCASE_SCHEMA,
  [ComponentName.ProductsCatalog]: PRODUCTS_CATALOG_SCHEMA,
  [ComponentName.SocialMedia]: SOCIAL_MEDIA_SCHEMA,
  [ComponentName.Footer]: FOOTER_SCHEMA,
};
