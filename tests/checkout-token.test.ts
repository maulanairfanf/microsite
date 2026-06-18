import { describe, it, expect, beforeAll } from "vitest";
import { signCheckoutToken, verifyCheckoutToken } from "@/lib/billing/checkout-token";

beforeAll(() => {
  process.env.BILLING_TOKEN_SECRET = "test-secret-1234567890abcdef";
});

describe("signCheckoutToken / verifyCheckoutToken", () => {
  it("round-trips a valid token", () => {
    const token = signCheckoutToken("tenant-1", "halamanku-cuid-123-timestamp");
    const payload = verifyCheckoutToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.tenantId).toBe("tenant-1");
    expect(payload?.externalId).toBe("halamanku-cuid-123-timestamp");
    expect(typeof payload?.iat).toBe("number");
    expect(typeof payload?.exp).toBe("number");
    expect(payload?.exp).toBeGreaterThan(payload?.iat ?? 0);
  });

  it("rejects a tampered payload", () => {
    const token = signCheckoutToken("tenant-1", "ext-1");
    const [payload, sig] = token.split(".");
    const tampered = Buffer.from(
      JSON.stringify({
        tenantId: "tenant-attacker",
        externalId: "ext-1",
        iat: 0,
        exp: 9999999999,
      }),
    ).toString("base64url");
    expect(verifyCheckoutToken(`${tampered}.${sig}`)).toBeNull();
    expect(payload).toBeDefined();
  });

  it("rejects a tampered signature", () => {
    const token = signCheckoutToken("tenant-1", "ext-1");
    const [payload] = token.split(".");
    const fakeSig = Buffer.from("a".repeat(43)).toString("base64url");
    expect(verifyCheckoutToken(`${payload}.${fakeSig}`)).toBeNull();
  });

  it("rejects null / empty / malformed input", () => {
    expect(verifyCheckoutToken(null)).toBeNull();
    expect(verifyCheckoutToken(undefined)).toBeNull();
    expect(verifyCheckoutToken("")).toBeNull();
    expect(verifyCheckoutToken("not-a-token")).toBeNull();
    expect(verifyCheckoutToken("only.one")).toBeNull();
    expect(verifyCheckoutToken("a.b.c.d")).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = signCheckoutToken("tenant-1", "ext-1");
    const [payload, sig] = token.split(".");
    const expired = Buffer.from(
      JSON.stringify({
        tenantId: "tenant-1",
        externalId: "ext-1",
        iat: 0,
        exp: 1,
      }),
    ).toString("base64url");
    expect(verifyCheckoutToken(`${expired}.${sig}`)).toBeNull();
  });

  it("two different externalIds produce different tokens", () => {
    const a = signCheckoutToken("tenant-1", "ext-a");
    const b = signCheckoutToken("tenant-1", "ext-b");
    expect(a).not.toBe(b);
    expect(verifyCheckoutToken(a)?.externalId).toBe("ext-a");
    expect(verifyCheckoutToken(b)?.externalId).toBe("ext-b");
  });
});
