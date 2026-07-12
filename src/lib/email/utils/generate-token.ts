import { randomBytes } from "crypto";

export function generateEmailVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function getEmailVerificationTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
