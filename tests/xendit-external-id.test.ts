import { describe, it, expect } from "vitest";
import { extractTenantIdFromExternalId } from "@/lib/billing/providers/xendit";

describe("extractTenantIdFromExternalId", () => {
  it("parses a well-formed halamanku externalId", () => {
    const cuid = "cm3kq1abc2def3ghi4jkl5mnop";
    const id = extractTenantIdFromExternalId(`halamanku-${cuid}-1718000000000`);
    expect(id).toBe(cuid);
  });

  it("returns null for null", () => {
    expect(extractTenantIdFromExternalId(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(extractTenantIdFromExternalId(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractTenantIdFromExternalId("")).toBeNull();
  });

  it("returns null when the prefix is wrong", () => {
    expect(extractTenantIdFromExternalId("foo-bar-1718000000000")).toBeNull();
  });

  it("returns null when there are not enough parts", () => {
    expect(extractTenantIdFromExternalId("halamanku-abc")).toBeNull();
  });

  it("only takes the segment after the prefix, not the timestamp", () => {
    const result = extractTenantIdFromExternalId("halamanku-cuid1-timestamp-extra");
    expect(result).toBe("cuid1");
  });

  it("rejects the literal {external_id} placeholder Xendit leaves unsubstituted", () => {
    expect(extractTenantIdFromExternalId("{external_id}")).toBeNull();
  });
});
