import { describe, it, expect } from "vitest";
import {
  getNestedValue,
  setNestedValue,
  getEmptyItem,
  updateArrayItemAt,
  addArrayItemAt,
  removeArrayItemAt,
  type ConfigField,
} from "@/lib/configState";

describe("getNestedValue", () => {
  it("returns top-level value", () => {
    expect(getNestedValue({ a: 1 }, ["a"])).toBe(1);
  });

  it("returns nested object value", () => {
    expect(getNestedValue({ a: { b: { c: 42 } } }, ["a", "b", "c"])).toBe(42);
  });

  it("walks into arrays by index", () => {
    expect(getNestedValue({ items: [{ name: "x" }, { name: "y" }] }, ["items", 1, "name"])).toBe("y");
  });

  it("returns undefined when path is broken", () => {
    expect(getNestedValue({ a: 1 }, ["a", "b"])).toBeUndefined();
  });

  it("returns undefined for null in path", () => {
    expect(getNestedValue({ a: null }, ["a", "b"])).toBeUndefined();
  });

  it("returns the whole object for empty path", () => {
    const obj = { a: 1 };
    expect(getNestedValue(obj, [])).toBe(obj);
  });
});

describe("setNestedValue", () => {
  it("sets a top-level key without mutating the input", () => {
    const input = { a: 1 };
    const result = setNestedValue(input, ["b"], 2);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(input).toEqual({ a: 1 });
  });

  it("creates intermediate objects when missing", () => {
    const result = setNestedValue({}, ["a", "b", "c"], "deep");
    expect(result).toEqual({ a: { b: { c: "deep" } } });
  });

  it("preserves sibling keys at each level", () => {
    const result = setNestedValue({ a: { x: 1, y: 2 } }, ["a", "z"], 3);
    expect(result).toEqual({ a: { x: 1, y: 2, z: 3 } });
  });

  it("sets a value at an array index", () => {
    const result = setNestedValue({ items: ["a", "b", "c"] }, ["items", 1], "B");
    expect(result).toEqual({ items: ["a", "B", "c"] });
  });

  it("returns the value itself when path is empty", () => {
    const result = setNestedValue({ a: 1 }, [], { replaced: true });
    expect(result).toEqual({ replaced: true });
  });

  it("does not mutate the source object deeply", () => {
    const input = { a: { b: 1 } };
    const result = setNestedValue(input, ["a", "b"], 2);
    expect(input.a.b).toBe(1);
    expect(result.a.b).toBe(2);
  });

  it("coerces a string-digit path key into a numeric array index", () => {
    const result = setNestedValue({ items: ["a", "b", "c"] }, ["items", "1"], "B");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result).toEqual({ items: ["a", "B", "c"] });
  });

  it("creates an array when a string-digit path key is used at a fresh position", () => {
    const result = setNestedValue({} as Record<string, unknown>, ["items", "0", "text"], "hello");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result).toEqual({ items: [{ text: "hello" }] });
  });

  it("keeps non-numeric string keys as object keys", () => {
    const result = setNestedValue({ a: 1 }, ["foo"], 2);
    expect(result).toEqual({ a: 1, foo: 2 });
  });
});

describe("getEmptyItem", () => {
  it("returns empty object when itemFields is undefined", () => {
    expect(getEmptyItem(undefined)).toEqual({});
  });

  it("returns empty object when itemFields is empty", () => {
    expect(getEmptyItem([])).toEqual({});
  });

  it("initializes text-like fields to empty string", () => {
    const fields: ConfigField[] = [
      { name: "title", label: "Title", type: "text" },
      { name: "count", label: "Count", type: "number" },
    ];
    expect(getEmptyItem(fields)).toEqual({ title: "", count: "" });
  });

  it("initializes array fields to empty array", () => {
    const fields: ConfigField[] = [
      { name: "tags", label: "Tags", type: "array" },
    ];
    expect(getEmptyItem(fields)).toEqual({ tags: [] });
  });

  it("recursively initializes object fields", () => {
    const fields: ConfigField[] = [
      {
        name: "meta",
        label: "Meta",
        type: "object",
        itemFields: [
          { name: "label", label: "Label", type: "text" },
        ],
      },
    ];
    expect(getEmptyItem(fields)).toEqual({ meta: { label: "" } });
  });
});

describe("updateArrayItemAt", () => {
  it("merges a field into the array item at the given index", () => {
    const obj = { items: [{ name: "a" }, { name: "b" }] };
    const result = updateArrayItemAt(obj, ["items"], 1, "name", "B");
    expect(result).toEqual({ items: [{ name: "a" }, { name: "B" }] });
  });

  it("creates the item slot if it does not exist", () => {
    const obj: Record<string, unknown> = { items: [] };
    const result = updateArrayItemAt(obj, ["items"], 0, "name", "new");
    expect(result).toEqual({ items: [{ name: "new" }] });
  });

  it("preserves sibling fields on the same item", () => {
    const obj = { items: [{ name: "a", url: "u" }] };
    const result = updateArrayItemAt(obj, ["items"], 0, "url", "U");
    expect(result).toEqual({ items: [{ name: "a", url: "U" }] });
  });

  it("walks a nested array path", () => {
    const obj = { groups: [{ rows: [{ v: 1 }] }] };
    const result = updateArrayItemAt(obj, ["groups", 0, "rows"], 0, "v", 2);
    expect(result).toEqual({ groups: [{ rows: [{ v: 2 }] }] });
  });

  it("does not mutate the input", () => {
    const obj = { items: [{ name: "a" }] };
    updateArrayItemAt(obj, ["items"], 0, "name", "A");
    expect(obj).toEqual({ items: [{ name: "a" }] });
  });
});

describe("addArrayItemAt", () => {
  it("appends an empty item to a top-level array", () => {
    const result = addArrayItemAt({ items: [{ name: "a" }] }, ["items"], [
      { name: "name", label: "Name", type: "text" },
    ]);
    expect(result).toEqual({ items: [{ name: "a" }, { name: "" }] });
  });

  it("creates the array if it does not exist", () => {
    const result = addArrayItemAt({}, ["items"], [
      { name: "name", label: "Name", type: "text" },
    ]);
    expect(result).toEqual({ items: [{ name: "" }] });
  });

  it("appends an empty object when itemFields is undefined", () => {
    const result = addArrayItemAt({ items: [{ x: 1 }] }, ["items"]);
    expect(result).toEqual({ items: [{ x: 1 }, {}] });
  });
});

describe("removeArrayItemAt", () => {
  it("removes the item at the given index", () => {
    const result = removeArrayItemAt({ items: ["a", "b", "c"] }, ["items"], 1);
    expect(result).toEqual({ items: ["a", "c"] });
  });

  it("is a no-op when index is out of range", () => {
    const result = removeArrayItemAt({ items: ["a"] }, ["items"], 5);
    expect(result).toEqual({ items: ["a"] });
  });

  it("treats a missing array as empty", () => {
    const result = removeArrayItemAt({}, ["items"], 0);
    expect(result).toEqual({ items: [] });
  });

  it("does not mutate the input", () => {
    const obj = { items: ["a", "b"] };
    removeArrayItemAt(obj, ["items"], 0);
    expect(obj).toEqual({ items: ["a", "b"] });
  });
});
