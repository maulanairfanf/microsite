"use client";

import { useCallback, useState } from "react";
import {
  setNestedValue,
  updateArrayItemAt,
  addArrayItemAt,
  removeArrayItemAt,
  type Path,
  type ConfigField,
} from "@/lib/configState";

export function useConfigState(initial: Record<string, unknown>) {
  const [config, setConfig] = useState<Record<string, unknown>>(initial);

  const update = useCallback((path: Path, value: unknown) => {
    setConfig((prev) => setNestedValue(prev, path, value));
  }, []);

  const updateArrayItem = useCallback(
    (arrayPath: Path, index: number, field: string, value: unknown) => {
      setConfig((prev) => updateArrayItemAt(prev, arrayPath, index, field, value));
    },
    [],
  );

  const addArrayItem = useCallback((arrayPath: Path, itemFields?: ConfigField[]) => {
    setConfig((prev) => addArrayItemAt(prev, arrayPath, itemFields));
  }, []);

  const removeArrayItem = useCallback((arrayPath: Path, index: number) => {
    setConfig((prev) => removeArrayItemAt(prev, arrayPath, index));
  }, []);

  return { config, update, updateArrayItem, addArrayItem, removeArrayItem };
}
