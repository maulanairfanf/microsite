"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Settings, Archive, RotateCcw, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientApi } from "@/lib/client-api";

interface TenantActionsDropdownProps {
  tenantId: string;
  tenantDbId: string;
  name: string;
  status: string;
  onArchive: (tenantDbId: string, newStatus: "active" | "archived") => void;
  onDeleted: (tenantDbId: string) => void;
}

export function TenantActionsDropdown({
  tenantId,
  tenantDbId,
  name,
  status,
  onArchive,
  onDeleted,
}: TenantActionsDropdownProps) {
  const router = useRouter();

  async function handleManage() {
    try {
      await clientApi.post("/api/super/impersonate", { tenantId });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Failed to impersonate tenant:", error);
    }
  }

  async function handleArchive() {
    const newStatus = status === "active" ? "archived" : "active";
    try {
      if (newStatus === "archived") {
        await clientApi.post(`/api/tenants/${tenantDbId}/archive`);
      } else {
        await clientApi.post(`/api/tenants/${tenantDbId}/restore`);
      }
      onArchive(tenantDbId, newStatus);
    } catch (error) {
      console.error("Failed to update tenant status:", error);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete "${name}"?\n\nThis will remove the tenant, all sections, and all users. This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await clientApi.delete(`/api/tenants/${tenantDbId}`);
      onDeleted(tenantDbId);
    } catch (error: any) {
      window.alert(error?.message || "Failed to delete tenant");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a
            href={`/${tenantId}`}
            target="_blank"
            className="flex items-center gap-2"
            rel="noreferrer"
          >
            <Eye className="w-4 h-4" />
            View
          </a>
        </DropdownMenuItem>

        {status === "active" && (
          <DropdownMenuItem onClick={handleManage} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Manage
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleArchive}
          className={`flex items-center gap-2 ${status === "active" ? "text-red-600" : "text-green-600"}`}
        >
          {status === "active" ? (
            <>
              <Archive className="w-4 h-4" />
              Archive
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              Restore
            </>
          )}
        </DropdownMenuItem>

        {status === "archived" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
