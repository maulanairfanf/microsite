'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/admin/FormFields';
import { Textarea } from '@/components/admin/FormFields';
import { Select } from '@/components/admin/FormFields';
import { clientApi } from '@/lib/client-api';

interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'array' | 'object';
  placeholder?: string;
  itemType?: string;
  itemFields?: ConfigField[];
}

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

function getEmptyItem(itemFields?: ConfigField[]): Record<string, any> {
  if (!itemFields) return {};
  const item: Record<string, any> = {};
  itemFields.forEach((f) => {
    if (f.type === 'array') {
      item[f.name] = [];
    } else if (f.type === 'object') {
      item[f.name] = getEmptyItem(f.itemFields);
    } else {
      item[f.name] = '';
    }
  });
  return item;
}

export function TenantSectionForm({ tenantId, section, components, isEdit }: TenantSectionFormProps) {
  const router = useRouter();
  const [selectedComponentId, setSelectedComponentId] = useState(section?.componentId || '');
  const [config, setConfig] = useState<Record<string, any>>(() => {
    if (section?.configJson) {
      try {
        const parsed = JSON.parse(section.configJson);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch {}
    }
    return {};
  });
  const [loading, setLoading] = useState(false);

  const handleComponentChange = useCallback((newId: string) => {
    setSelectedComponentId(newId);
  }, []);

  function updateConfig(field: string, value: any) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  function updateArrayItem(arrayPath: string[], index: number, field: string, value: any) {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < arrayPath.length - 1; i++) {
        current[arrayPath[i]] = { ...(current[arrayPath[i]] || {}) };
        current = current[arrayPath[i]];
      }
      const lastKey = arrayPath[arrayPath.length - 1];
      const items = [...(current[lastKey] || [])];
      items[index] = { ...(items[index] || {}), [field]: value };
      current[lastKey] = items;
      return newConfig;
    });
  }

  function addArrayItem(arrayPath: string[], itemFields?: ConfigField[]) {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < arrayPath.length - 1; i++) {
        current[arrayPath[i]] = { ...(current[arrayPath[i]] || {}) };
        current = current[arrayPath[i]];
      }
      const lastKey = arrayPath[arrayPath.length - 1];
      const items = [...(current[lastKey] || [])];
      items.push(getEmptyItem(itemFields));
      current[lastKey] = items;
      return newConfig;
    });
  }

  function removeArrayItem(arrayPath: string[], index: number) {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < arrayPath.length - 1; i++) {
        current[arrayPath[i]] = { ...(current[arrayPath[i]] || {}) };
        current = current[arrayPath[i]];
      }
      const lastKey = arrayPath[arrayPath.length - 1];
      const items = [...(current[lastKey] || [])];
      items.splice(index, 1);
      current[lastKey] = items;
      return newConfig;
    });
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const order = parseInt(formData.get('order') as string) || 0;

    try {
      if (isEdit && section?.id) {
        await clientApi.put(`/api/sections/${section.id}`, {
          componentId: selectedComponentId || null,
          order,
          configJson: JSON.stringify(config)
        });
      } else {
        await clientApi.post('/api/sections', {
          tenantId,
          componentId: selectedComponentId || null,
          order,
          configJson: JSON.stringify(config)
        });
      }

      router.push('/admin/sections');
      router.refresh();
    } catch (err) {
      console.error('Failed to save section:', err);
    } finally {
      setLoading(false);
    }
  }

  const selectedComponentData = components.find((c) => c.value === selectedComponentId);
  let fields: ConfigField[] = [];
  if (selectedComponentData?.configSchema) {
    try {
      fields = JSON.parse(selectedComponentData.configSchema);
    } catch {}
  }

  function renderField(field: ConfigField, pathPrefix: string[] = []): React.ReactNode {
    const value = getNestedValue(config, [...pathPrefix, field.name]);

    if (field.type === 'array') {
      const items: any[] = Array.isArray(value) ? value : [];
      const fieldPath = [...pathPrefix, field.name];
      return (
        <div key={fieldPath.join('.')} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{field.label}</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldPath, field.itemFields)}
            >
              + Add
            </Button>
          </div>
          {items.map((item: Record<string, any>, index: number) => (
            <div key={index} className="rounded-md p-3 space-y-3 relative border border-border">
              <button
                type="button"
                onClick={() => removeArrayItem(fieldPath, index)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
              {field.itemFields?.map((subField) => (
                <div key={subField.name} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{subField.label}</label>
                  {subField.type === 'array' || subField.type === 'object' ? (
                    renderField(subField, fieldPath.length > 0 ? [...pathPrefix, field.name, String(index)] : [...pathPrefix, field.name, String(index)])
                  ) : subField.type === 'textarea' ? (
                    <Textarea
                      value={getNestedValue(config, [...pathPrefix, field.name, String(index), subField.name]) ?? ''}
                      onChange={(e) => updateArrayItem([...pathPrefix, field.name], index, subField.name, e.target.value)}
                      placeholder={subField.placeholder || subField.label}
                    />
                  ) : (
                    <Input
                      type={subField.type === 'number' ? 'number' : 'text'}
                      value={getNestedValue(config, [...pathPrefix, field.name, String(index), subField.name]) ?? ''}
                      onChange={(e) =>
                        updateArrayItem(
                          [...pathPrefix, field.name],
                          index,
                          subField.name,
                          subField.type === 'number' ? Number(e.target.value) : e.target.value
                        )
                      }
                      placeholder={subField.placeholder || subField.label}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No items yet. Click "+ Add" to add one.</p>
          )}
        </div>
      );
    }

    if (field.type === 'object') {
      const obj: Record<string, any> = value && typeof value === 'object' ? value : {};
      const fieldPath = [...pathPrefix, field.name];
      return (
        <div key={fieldPath.join('.')} className="space-y-2 border border-border rounded-md p-3">
          <label className="text-sm font-medium text-foreground">{field.label}</label>
          {field.itemFields?.map((subField) => (
            <div key={subField.name} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{subField.label}</label>
              {subField.type === 'textarea' ? (
                <Textarea
                  value={obj[subField.name] ?? ''}
                  onChange={(e) =>
                    setConfig((prev) => {
                      const newConfig = { ...prev };
                      let current: any = newConfig;
                      for (let i = 0; i < pathPrefix.length; i++) {
                        current[pathPrefix[i]] = { ...(current[pathPrefix[i]] || {}) };
                        current = current[pathPrefix[i]];
                      }
                      current[field.name] = { ...(current[field.name] || {}), [subField.name]: e.target.value };
                      return newConfig;
                    })
                  }
                  placeholder={subField.placeholder || subField.label}
                />
              ) : (
                <Input
                  type={subField.type === 'number' ? 'number' : 'text'}
                  value={obj[subField.name] ?? ''}
                  onChange={(e) =>
                    setConfig((prev) => {
                      const newConfig = { ...prev };
                      let current: any = newConfig;
                      for (let i = 0; i < pathPrefix.length; i++) {
                        current[pathPrefix[i]] = { ...(current[pathPrefix[i]] || {}) };
                        current = current[pathPrefix[i]];
                      }
                      current[field.name] = {
                        ...(current[field.name] || {}),
                        [subField.name]: subField.type === 'number' ? Number(e.target.value) : e.target.value
                      };
                      return newConfig;
                    })
                  }
                  placeholder={subField.placeholder || subField.label}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name}>
          <label className="text-sm font-medium text-foreground">{field.label}</label>
          <Textarea
            value={value ?? ''}
            onChange={(e) => updateConfig(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1"
          />
        </div>
      );
    }

    return (
      <div key={field.name}>
        <label className="text-sm font-medium text-foreground">{field.label}</label>
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value ?? ''}
          onChange={(e) =>
            updateConfig(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)
          }
          placeholder={field.placeholder}
          className="mt-1"
        />
      </div>
    );
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
            {fields.map((field) => renderField(field, []))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Section'}
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

function getNestedValue(obj: any, path: (string | number)[]): any {
  let current: any = obj;
  for (const key of path) {
    if (current == null) return undefined;
    current = current[key as keyof typeof current];
  }
  return current;
}
