export type Path = readonly (string | number)[];

export function getNestedValue(obj: unknown, path: Path): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
}

export function setNestedValue<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (head === undefined) return obj;
  const key = typeof head === "string" && /^\d+$/.test(head) ? Number(head) : head;
  if (typeof key === "number") {
    const base = Array.isArray(obj) ? obj : [];
    const cloned: unknown[] = [...base];
    cloned[key] = setNestedValue(cloned[key], rest, value);
    return cloned as unknown as T;
  }
  const baseObj =
    obj && typeof obj === "object" && !Array.isArray(obj) ? (obj as Record<string, unknown>) : {};
  const cloned: Record<string, unknown> = { ...baseObj };
  cloned[key] = setNestedValue(cloned[key], rest, value);
  return cloned as T;
}

export function getEmptyItem(itemFields?: ConfigField[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  item.id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  for (const f of itemFields ?? []) {
    if (f.name === "id") continue;
    if (f.type === "array") {
      item[f.name] = [];
    } else if (f.type === "object") {
      item[f.name] = getEmptyItem(f.itemFields);
    } else {
      item[f.name] = "";
    }
  }
  return item;
}

export function updateArrayItemAt(
  obj: Record<string, unknown>,
  arrayPath: Path,
  index: number,
  field: string,
  value: unknown,
): Record<string, unknown> {
  const items = (getNestedValue(obj, arrayPath) as unknown[]) ?? [];
  const next = [...items];
  const current = (next[index] as Record<string, unknown>) ?? {};
  next[index] = { ...current, [field]: value };
  return setNestedValue(obj, arrayPath, next);
}

export function addArrayItemAt(
  obj: Record<string, unknown>,
  arrayPath: Path,
  itemFields?: ConfigField[],
): Record<string, unknown> {
  const items = (getNestedValue(obj, arrayPath) as unknown[]) ?? [];
  const next = [...items, getEmptyItem(itemFields)];
  return setNestedValue(obj, arrayPath, next);
}

export function removeArrayItemAt(
  obj: Record<string, unknown>,
  arrayPath: Path,
  index: number,
): Record<string, unknown> {
  const items = (getNestedValue(obj, arrayPath) as unknown[]) ?? [];
  const next = [...items];
  next.splice(index, 1);
  return setNestedValue(obj, arrayPath, next);
}

export interface ConfigField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "array" | "object" | "file";
  placeholder?: string;
  itemType?: string;
  itemFields?: ConfigField[];
  /** Aspect ratio for file field image preview, e.g. "4:3", "16:9", "1:1" */
  aspectRatio?: string;
  width?: number;
  /** When true, the field is displayed as read-only (disabled). Useful for auto-computed fields. */
  readOnly?: boolean;
}
