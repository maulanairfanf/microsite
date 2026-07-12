import type { Path, ConfigField } from "@/lib/configState";

export type { Path, ConfigField };

export interface FieldContext {
  field: ConfigField;
  path: Path;
  value: unknown;
  update: (path: Path, value: unknown) => void;
  updateArrayItem: (arrayPath: Path, index: number, field: string, value: unknown) => void;
  addArrayItem: (arrayPath: Path, itemFields?: ConfigField[]) => void;
  removeArrayItem: (arrayPath: Path, index: number) => void;
}
