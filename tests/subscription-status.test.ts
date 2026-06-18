import { describe, it, expect } from "vitest";
import { SubscriptionStatus } from "@/lib/db/billing";

describe("SubscriptionStatus const values", () => {
  it("Active matches wire string", () => {
    expect(SubscriptionStatus.Active).toBe("active");
  });

  it("Canceled matches wire string", () => {
    expect(SubscriptionStatus.Canceled).toBe("canceled");
  });

  it("PastDue matches wire string", () => {
    expect(SubscriptionStatus.PastDue).toBe("past_due");
  });

  it("Expired matches wire string", () => {
    expect(SubscriptionStatus.Expired).toBe("expired");
  });
});