"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TenantActionsDropdown } from "./actions-dropdown";
import { clientApi } from "@/lib/client-api";

interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  status: string;
  themeId: string | null;
  showOnLanding: boolean;
  createdAt: Date;
}

interface TenantsTableProps {
  tenants: Tenant[];
  themeMap: Map<string, { name: string }>;
}

export function TenantsTable({ tenants, themeMap }: TenantsTableProps) {
  const [localTenants, setLocalTenants] = useState(tenants);

  function handleArchive(tenantDbId: string, newStatus: "active" | "archived") {
    setLocalTenants((prev) =>
      prev.map((t) => (t.id === tenantDbId ? { ...t, status: newStatus } : t)),
    );
  }

  function handleDeleted(tenantDbId: string) {
    setLocalTenants((prev) => prev.filter((t) => t.id !== tenantDbId));
  }

  async function toggleShowcase(tenant: Tenant) {
    const next = !tenant.showOnLanding;
    setLocalTenants((prev) =>
      prev.map((t) => (t.id === tenant.id ? { ...t, showOnLanding: next } : t)),
    );
    try {
      await clientApi.put(`/api/tenants/${tenant.id}`, { showOnLanding: next });
    } catch {
      setLocalTenants((prev) =>
        prev.map((t) => (t.id === tenant.id ? { ...t, showOnLanding: !next } : t)),
      );
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tenant
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Theme
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Showcase
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {localTenants.map((tenant) => {
            const theme = tenant.themeId ? themeMap.get(tenant.themeId) : null;
            return (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-purple-600">
                        {tenant.name?.charAt(0) || "T"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">/{tenant.tenantId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={tenant.status === "active" ? "default" : "secondary"}
                    className={tenant.status === "archived" ? "bg-gray-100 text-gray-600" : ""}
                  >
                    {tenant.status === "active" ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Archived
                      </span>
                    )}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {theme ? (
                    <span className="text-sm text-gray-700">{theme.name}</span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleShowcase(tenant)}
                    className={`text-xs font-medium px-2 py-1 rounded border transition-colors ${
                      tenant.showOnLanding
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {tenant.showOnLanding ? "Shown" : "Show"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <TenantActionsDropdown
                      tenantId={tenant.tenantId}
                      tenantDbId={tenant.id}
                      name={tenant.name}
                      status={tenant.status}
                      onArchive={handleArchive}
                      onDeleted={handleDeleted}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
