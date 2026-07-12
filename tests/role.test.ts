import { describe, it, expect } from "vitest";
import { Role } from "@/lib/constants";

describe("Role const values", () => {
  it("SuperAdmin matches wire string", () => {
    expect(Role.SuperAdmin).toBe("super_admin");
  });

  it("TenantMainAdmin matches wire string", () => {
    expect(Role.TenantMainAdmin).toBe("tenant_main_admin");
  });

  it("TenantAdmin matches wire string", () => {
    expect(Role.TenantAdmin).toBe("tenant_admin");
  });
});