"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/admin/FormFields";
import { clientApi } from "@/lib/client-api";
import { useConfigState } from "@/hooks/useConfigState";
import { FieldRenderer } from "@/components/admin/section-form/fields/FieldRenderer";
import type { ConfigField } from "@/components/admin/section-form/types";

interface TenantSectionFormProps {
  tenantId: string;
  section?: {
    id: string;
    componentId: string | null;
    component: { id: string; name: string } | null;
    order: number;
    configJson?: string;
  };
  components: { value: string; label: string; configSchema?: string }[];
  isEdit: boolean;
}

function parseConfigJson(json?: string): Record<string, unknown> {
  if (!json) return {};
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {}
  return {};
}

function parseSchema(json?: string): ConfigField[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed as ConfigField[];
    }
  } catch {}
  return [];
}

export function TenantSectionForm({
  tenantId,
  section,
  components,
  isEdit,
}: TenantSectionFormProps) {
  const router = useRouter();
  const [selectedComponentId, setSelectedComponentId] = useState(section?.componentId || "");
  const { config, update, updateArrayItem, addArrayItem, removeArrayItem } = useConfigState(
    parseConfigJson(section?.configJson),
  );
  const [loading, setLoading] = useState(false);

  const selectedComponent = components.find((c) => c.value === selectedComponentId);
  const fields = parseSchema(selectedComponent?.configSchema);

  const handleComponentChange = useCallback((newId: string) => {
    setSelectedComponentId(newId);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const order = parseInt(formData.get("order") as string) || 0;
    const payload = {
      componentId: selectedComponentId || null,
      order,
      configJson: JSON.stringify(config),
    };
    try {
      if (isEdit && section?.id) {
        await clientApi.put(`/api/sections/${section.id}`, payload);
      } else {
        await clientApi.post("/api/sections", { tenantId, ...payload });
      }
      router.push("/admin/sections");
      router.refresh();
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Select
          name="component"
          label="Component Type"
          options={components}
          placeholder="Select Component"
          value={selectedComponentId}
          onValueChange={handleComponentChange}
          required
        />

        <Input
          name="order"
          label="Order"
          type="number"
          placeholder="0"
          defaultValue={section?.order || 0}
          required
        />

        {fields.length > 0 && (
          <div className="rounded-lg space-y-4">
            {fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                path={[field.name]}
                value={config[field.name]}
                update={update}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 px-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Section"}
        </Button>
        <Link href="/admin/sections">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
