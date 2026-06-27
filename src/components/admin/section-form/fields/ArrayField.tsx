import { Button } from "@/components/ui/button";
import { FieldRenderer } from "./FieldRenderer";
import type { FieldContext } from "../types";

export function ArrayField({ field, path, value, update, updateArrayItem, addArrayItem, removeArrayItem }: FieldContext) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{field.label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(path, field.itemFields)}
        >
          + Add
        </Button>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-md p-3 space-y-3 relative border border-border"
        >
          <button
            type="button"
            onClick={() => removeArrayItem(path, index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
            aria-label={`Remove item ${index + 1}`}
          >
            ×
          </button>
          {(field.itemFields ?? []).map((subField) => {
            const subValue = item?.[subField.name];
            const subPath = [...path, index, subField.name];
            return (
              <FieldRenderer
                key={subField.name}
                field={subField}
                path={subPath}
                value={subValue}
                update={update}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            );
          })}
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No items yet. Click &ldquo;+ Add&rdquo; to add one.
        </p>
      )}
    </div>
  );
}
