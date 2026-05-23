'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Settings, Archive, RotateCcw, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clientApi } from '@/lib/client-api';

interface TenantActionsDropdownProps {
  tenantId: string;
  tenantDbId: string;
  status: string;
  onArchive: (tenantDbId: string, newStatus: 'active' | 'archived') => void;
}

export function TenantActionsDropdown({
  tenantId,
  tenantDbId,
  status,
  onArchive,
}: TenantActionsDropdownProps) {
  const router = useRouter();

  async function handleManage() {
    try {
      await clientApi.post('/api/super/impersonate', { tenantId });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Failed to impersonate tenant:', error);
    }
  }

  function handleArchive() {
    const newStatus = status === 'active' ? 'archived' : 'active';
    onArchive(tenantDbId, newStatus);
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
          <a href={`/${tenantId}`} target="_blank" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View
          </a>
        </DropdownMenuItem>

        {status === 'active' && (
          <DropdownMenuItem onClick={handleManage} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Manage
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <a href={`/super/tenants/${tenantDbId}`} className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleArchive}
          className={`flex items-center gap-2 ${status === 'active' ? 'text-red-600' : 'text-green-600'}`}
        >
          {status === 'active' ? (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}