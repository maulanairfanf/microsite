'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/admin/FormFields';
import { Select } from '@/components/admin/FormFields';
import { clientApi } from '@/lib/client-api';

interface TenantSettingsFormProps {
  tenant: {
    id: string;
    tenantId: string;
    name: string;
    themeId: string | null;
  };
  themes: { value: string; label: string }[];
}

export function TenantSettingsForm({ tenant, themes }: TenantSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(tenant.themeId || '');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const name = formData.get("name") as string;

    try {
      await clientApi.put(`/api/tenants/${tenant.id}`, { name, themeId: selectedTheme || null });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      window.location.reload();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          name="name"
          label="Tenant Name"
          defaultValue={tenant.name}
          required
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Tenant ID (URL Slug)</label>
          <Input
            value={tenant.tenantId}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">This cannot be changed</p>
        </div>

        <Select
          name="themeId"
          label="Theme"
          options={themes}
          value={selectedTheme}
          onValueChange={setSelectedTheme}
        />
      </div>

      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}