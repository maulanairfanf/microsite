import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FieldRenderer } from "./FieldRenderer";
import type { FieldContext } from "../types";

export function ArrayField({
  field,
  path,
  value,
  update,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: FieldContext) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  // Auto-compute final price from originalPrice + discount
  useEffect(() => {
    items.forEach((item, index) => {
      if (item.originalPrice && item.discount && item.price !== undefined) {
        const pct = parseInt(String(item.discount).replace("%", ""), 10) || 0;
        if (pct > 0) {
          const computed = Math.round(Number(item.originalPrice) * (1 - pct / 100));
          if (computed !== Number(item.price)) {
            updateArrayItem(path, index, "price", computed);
          }
        }
      }
    });
  }, [value, path, updateArrayItem]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div key={index} className="rounded-md p-3 space-y-3 relative border border-border">
          <Button
            onClick={() => removeArrayItem(path, index)}
            className="absolute top-2 right-2 "
            aria-label={`Remove item ${index + 1}`}
            variant="destructive"
            size="xs"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {(field.itemFields ?? []).map((subField) => {
            const isPriceAuto = subField.name === "price" && item.originalPrice && item.discount;
            const enhancedField = isPriceAuto ? { ...subField, readOnly: true } : subField;
            const subValue = isPriceAuto
              ? (() => {
                  const pct = parseInt(String(item.discount).replace("%", ""), 10) || 0;
                  return pct > 0 ? Math.round(Number(item.originalPrice) * (1 - pct / 100)) : item.price;
                })()
              : item?.[subField.name];
            return (
              <FieldRenderer
                key={subField.name}
                field={enhancedField}
                path={[...path, index, subField.name]}
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
