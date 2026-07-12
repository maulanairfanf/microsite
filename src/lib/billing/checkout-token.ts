import { createHmac, timingSafeEqual } from "node:crypto";

const TTL_SECONDS = 30 * 60;

export interface CheckoutTokenPayload {
  tenantId: string;
  externalId: string;
  iat: number;
  exp: number;
}

const PLACEHOLDER_SECRET = "dev-placeholder-change-me-set-billing-token-secret";

function getSecret(): string {
  const secret = process.env.BILLING_TOKEN_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BILLING_TOKEN_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to your .env",
    );
  }
  return PLACEHOLDER_SECRET;
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function hmac(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

export function signCheckoutToken(tenantId: string, externalId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: CheckoutTokenPayload = {
    tenantId,
    externalId,
    iat: now,
    exp: now + TTL_SECONDS,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = base64url(hmac(encodedPayload, getSecret()));
  return `${encodedPayload}.${signature}`;
}

export function verifyCheckoutToken(token: string | null | undefined): CheckoutTokenPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, providedSig] = parts as [string, string];

  let payloadBuf: Buffer;
  let providedSigBuf: Buffer;
  try {
    payloadBuf = base64urlDecode(encodedPayload);
    providedSigBuf = base64urlDecode(providedSig);
  } catch {
    return null;
  }

  const expectedSig = hmac(encodedPayload, getSecret());
  if (providedSigBuf.length !== expectedSig.length) return null;
  if (!timingSafeEqual(providedSigBuf, expectedSig)) return null;

  let payload: CheckoutTokenPayload;
  try {
    payload = JSON.parse(payloadBuf.toString("utf8")) as CheckoutTokenPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.tenantId !== "string" ||
    typeof payload.externalId !== "string" ||
    typeof payload.exp !== "number" ||
    typeof payload.iat !== "number"
  ) {
    return null;
  }

  if (Math.floor(Date.now() / 1000) > payload.exp) return null;

  return payload;
}
