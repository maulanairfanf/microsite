import { describe, it, expect } from "vitest";
import { Plan } from "@/lib/constants";

describe("Plan const values", () => {
  it("Free matches wire string", () => {
    expect(Plan.Free).toBe("free");
  });

  it("Premium matches wire string", () => {
    expect(Plan.Premium).toBe("premium");
  });
});