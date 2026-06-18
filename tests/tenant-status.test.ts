import { describe, it, expect } from "vitest";
import { TenantStatus } from "@/lib/db/tenants";

describe("TenantStatus const values", () => {
  it("Active matches wire string", () => {
    expect(TenantStatus.Active).toBe("active");
  });

  it("Archived matches wire string", () => {
    expect(TenantStatus.Archived).toBe("archived");
  });
});