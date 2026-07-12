import { describe, it, expect } from "vitest";
import { isValidSlug, isReservedSlug, SLUG_REGEX } from "@/lib/slug";

function isAcceptableSignUpSlug(slug: string): boolean {
  return isValidSlug(slug) && slug.length >= 3;
}

describe("isValidSlug", () => {
  it("accepts a simple lowercase slug", () => {
    expect(isValidSlug("hello")).toBe(true);
  });

  it("accepts a single lowercase character (regex only; length is enforced separately)", () => {
    expect(isValidSlug("a")).toBe(true);
  });

  it("accepts slugs with numbers", () => {
    expect(isValidSlug("shop-123")).toBe(true);
  });

  it("accepts the maximum length (40 chars)", () => {
    expect(isValidSlug("a".repeat(40))).toBe(true);
  });

  it("rejects slugs longer than 40 chars", () => {
    expect(isValidSlug("a".repeat(41))).toBe(false);
  });

  it("rejects uppercase letters", () => {
    expect(isValidSlug("Hello")).toBe(false);
  });

  it("rejects leading dash", () => {
    expect(isValidSlug("-hello")).toBe(false);
  });

  it("rejects trailing dash", () => {
    expect(isValidSlug("hello-")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });

  it("rejects spaces", () => {
    expect(isValidSlug("hello world")).toBe(false);
  });

  it("rejects special characters", () => {
    expect(isValidSlug("hello!")).toBe(false);
    expect(isValidSlug("héllo")).toBe(false);
    expect(isValidSlug("hello@world")).toBe(false);
  });

  it("rejects underscores", () => {
    expect(isValidSlug("hello_world")).toBe(false);
  });
});

describe("isReservedSlug", () => {
  it("blocks admin", () => {
    expect(isReservedSlug("admin")).toBe(true);
  });

  it("blocks api", () => {
    expect(isReservedSlug("api")).toBe(true);
  });

  it("blocks login", () => {
    expect(isReservedSlug("login")).toBe(true);
  });

  it("blocks sign-up", () => {
    expect(isReservedSlug("sign-up")).toBe(true);
  });

  it("does not block a normal slug", () => {
    expect(isReservedSlug("my-shop")).toBe(false);
    expect(isReservedSlug("coffee-shop")).toBe(false);
  });
});

describe("SLUG_REGEX constant", () => {
  it("matches the documented rules", () => {
    expect(SLUG_REGEX.test("hello")).toBe(true);
    expect(SLUG_REGEX.test("a-b-c")).toBe(true);
    expect(SLUG_REGEX.test("123abc")).toBe(true);
    expect(SLUG_REGEX.test("Hello")).toBe(false);
    expect(SLUG_REGEX.test("-hello")).toBe(false);
    expect(SLUG_REGEX.test("hello-")).toBe(false);
  });
});

describe("combined sign-up slug rule (regex + length >= 3)", () => {
  it("accepts 3+ character valid slugs", () => {
    expect(isAcceptableSignUpSlug("abc")).toBe(true);
    expect(isAcceptableSignUpSlug("my-shop")).toBe(true);
  });

  it("rejects short valid regex matches below 3 chars", () => {
    expect(isAcceptableSignUpSlug("ab")).toBe(false);
    expect(isAcceptableSignUpSlug("a")).toBe(false);
  });

  it("rejects regex-invalid slugs regardless of length", () => {
    expect(isAcceptableSignUpSlug("Hello-World")).toBe(false);
    expect(isAcceptableSignUpSlug("hello world")).toBe(false);
  });
});
