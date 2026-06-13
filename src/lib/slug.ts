export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

export const RESERVED_SLUGS = new Set([
  "admin",
  "super",
  "api",
  "login",
  "sign-up",
  "signin",
  "signup",
  "logout",
  "settings",
  "public",
  "static",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "components",
  "themes",
  "users",
  "tenants",
  "sections",
  "auth",
  "register",
]);

export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}
