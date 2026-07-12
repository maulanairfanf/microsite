import { describe, it, expect, vi, beforeEach } from "vitest";
import { useConfigState } from "@/hooks/useConfigState";
import * as configState from "@/lib/configState";

vi.mock("react", () => ({
  useState: <T,>(initial: T) => {
    let value = initial;
    const set = (updater: T | ((prev: T) => T)) => {
      value = typeof updater === "function" ? (updater as (prev: T) => T)(value) : updater;
    };
    return [value, set] as const;
  },
  useCallback: <T,>(fn: T) => fn,
}));

beforeEach(() => {
  vi.spyOn(configState, "setNestedValue");
  vi.spyOn(configState, "updateArrayItemAt");
  vi.spyOn(configState, "addArrayItemAt");
  vi.spyOn(configState, "removeArrayItemAt");
});

describe("useConfigState", () => {
  it("returns the initial config", () => {
    const { config } = useConfigState({ initial: "value" });
    expect(config).toEqual({ initial: "value" });
  });

  it("exposes the five handler keys", () => {
    const ctrl = useConfigState({});
    expect(Object.keys(ctrl).sort()).toEqual([
      "addArrayItem",
      "config",
      "removeArrayItem",
      "update",
      "updateArrayItem",
    ]);
  });

  it("update delegates to setNestedValue", () => {
    const { update } = useConfigState({});
    update(["a", "b"], 1);
    expect(configState.setNestedValue).toHaveBeenCalled();
  });

  it("updateArrayItem delegates to updateArrayItemAt", () => {
    const { updateArrayItem } = useConfigState({});
    updateArrayItem(["items"], 0, "name", "x");
    expect(configState.updateArrayItemAt).toHaveBeenCalled();
  });

  it("addArrayItem delegates to addArrayItemAt", () => {
    const { addArrayItem } = useConfigState({});
    addArrayItem(["items"], []);
    expect(configState.addArrayItemAt).toHaveBeenCalled();
  });

  it("removeArrayItem delegates to removeArrayItemAt", () => {
    const { removeArrayItem } = useConfigState({});
    removeArrayItem(["items"], 0);
    expect(configState.removeArrayItemAt).toHaveBeenCalled();
  });
});
