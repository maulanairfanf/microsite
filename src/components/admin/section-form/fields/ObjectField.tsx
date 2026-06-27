import { FieldRenderer } from "./FieldRenderer";
import type { FieldContext } from "../types";

export function ObjectField({ field, path, value, update, updateArrayItem, addArrayItem, removeArrayItem }: FieldContext) {
  const subFields = field.itemFields ?? [];
  return (
    <div className="space-y-2 border border-border rounded-md p-3">
      <label className="text-sm font-medium text-foreground">{field.label}</label>
      {subFields.map((subField) => {
        const subValue =
          value && typeof value === "object"
            ? (value as Record<string, unknown>)[subField.name]
            : undefined;
        return (
          <FieldRenderer
            key={subField.name}
            field={subField}
            path={[...path, subField.name]}
            value={subValue}
            update={update}
            updateArrayItem={updateArrayItem}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      })}
    </div>
  );
}
