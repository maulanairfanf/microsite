import { Input, Textarea } from "@/components/admin/FormFields";
import type { FieldContext } from "../types";

export function TextField({ field, path, value, update }: FieldContext) {
  if (field.type === "textarea") {
    return (
      <div>
        <label className="text-sm font-medium text-foreground">{field.label}</label>
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => update(path, e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium text-foreground">{field.label}</label>
      <Input
        type={field.type === "number" ? "number" : "text"}
        value={(value as string | number) ?? ""}
        onChange={(e) =>
          update(path, field.type === "number" ? Number(e.target.value) : e.target.value)
        }
        placeholder={field.placeholder}
        className="mt-1"
        disabled={field.readOnly}
      />
    </div>
  );
}
