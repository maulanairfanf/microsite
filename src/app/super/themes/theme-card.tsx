"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientApi } from "@/lib/client-api";

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    slug: string;
    config: string | null;
  };
  tenantCount: number;
  onDeleted: (id: string) => void;
  onError: (message: string) => void;
}

export function ThemeCard({ theme, tenantCount, onDeleted, onError }: ThemeCardProps) {
  const [deleting, setDeleting] = useState(false);

  let pageBg = "#ccc";
  try {
    if (theme.config) {
      const config = JSON.parse(theme.config);
      pageBg = config.page?.background || "#ccc";
    }
  } catch {}

  async function handleDelete() {
    if (tenantCount > 0) {
      onError(
        `Cannot delete "${theme.name}": ${tenantCount} tenant${tenantCount === 1 ? "" : "s"} ${tenantCount === 1 ? "is" : "are"} using it.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete theme "${theme.name}"?\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await clientApi.delete(`/api/themes/${theme.id}`);
      onDeleted(theme.id);
    } catch (err: any) {
      onError(err?.message || "Failed to delete theme");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-lg shrink-0" style={{ backgroundColor: pageBg }} />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{theme.name}</h3>
            <p className="text-sm text-gray-500 truncate">Slug: {theme.slug}</p>
            {tenantCount > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                Used by {tenantCount} tenant{tenantCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/super/themes/${theme.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                disabled={deleting}
                aria-label="More actions"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  href={`/super/themes/${theme.id}`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
