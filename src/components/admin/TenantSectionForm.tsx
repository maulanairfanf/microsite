'use client';

import { useState, useEffect } from 'react';
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
  type: 'text' | 'number' | 'textarea' | 'array';
  placeholder?: string;
  itemType?: string;
  itemFields?: { name: string; label: string; type: string }[];
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

export function TenantSectionForm({ tenantId, section, components, isEdit }: TenantSectionFormProps) {
  const router = useRouter();
  const [selectedComponentId, setSelectedComponentId] = useState(section?.componentId || '');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (section?.configJson) {
      try {
        const parsed = JSON.parse(section.configJson);
        setConfig(parsed);
      } catch {
        setConfig({});
      }
    } else {
      setConfig({});
    }
  }, [section?.configJson]);

  function updateConfig(field: string, value: any) {
    setConfig(prev => ({ ...prev, [field]: value }));
  }

  function updateArrayItem(arrayField: string, index: number, field: string, value: string) {
    const items = [...(config[arrayField] || [])];
    items[index] = { ...items[index], [field]: value };
    updateConfig(arrayField, items);
  }

  function addArrayItem(arrayField: string) {
    const items = [...(config[arrayField] || [])];
    const newItem: Record<string, string> = {};
    updateConfig(arrayField, [...items, newItem]);
  }

  function removeArrayItem(arrayField: string, index: number) {
    const items = [...(config[arrayField] || [])];
    items.splice(index, 1);
    updateConfig(arrayField, items);
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

  const selectedComponentData = components.find(c => c.value === selectedComponentId);
  let fields: ConfigField[] = [];
  if (selectedComponentData?.configSchema) {
    try {
      fields = JSON.parse(selectedComponentData.configSchema);
    } catch {}
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
          onValueChange={setSelectedComponentId}
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
            {fields.map(field => {
              if (field.type === 'array') {
                const items = config[field.name] || [];
                return (
                  <div key={field.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">{field.label}</label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(field.name)}>
                        + Add
                      </Button>
                    </div>
                    {items.map((item: Record<string, any>, index: number) => (
                      <div key={index} className=" rounded-md p-3 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => removeArrayItem(field.name, index)}
                          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                        {field.itemFields?.map(itemField => (
                          <div key={itemField.name}>
                            <label className="text-xs font-medium text-muted-foreground">{itemField.label}</label>
                            <Input
                              value={item[itemField.name] || ''}
                              onChange={(e) => updateArrayItem(field.name, index, itemField.name, e.target.value)}
                              placeholder={itemField.label}
                            />
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

              return (
                <div key={field.name}>
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={config[field.name] || ''}
                      onChange={(e) => updateConfig(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={config[field.name] || ''}
                      onChange={(e) => updateConfig(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Section')}
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