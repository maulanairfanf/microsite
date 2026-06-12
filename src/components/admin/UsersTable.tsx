"use client";

import { useState } from "react";
import { MoreHorizontal, UserPlus, Trash2, ArrowRightLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | string;
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
  currentUserRole: string;
  onRefresh: () => void;
  onAddUser: () => void;
}

export function UsersTable({
  users,
  currentUserId,
  currentUserRole,
  onRefresh,
  onAddUser,
}: UsersTableProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      await clientApi.delete(`/api/users/${userId}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransferOwnership(userId: string) {
    if (!confirm("Transfer ownership to this user? You will become a regular admin.")) return;

    setLoading(true);
    try {
      await clientApi.post("/api/users/transfer-ownership", { userId });
      alert("Ownership transferred! Please refresh the page.");
      onRefresh();
    } catch (err) {
      console.error("Failed to transfer ownership:", err);
      alert("Failed to transfer ownership");
    } finally {
      setLoading(false);
    }
  }

  function getRoleBadgeVariant(role: string) {
    switch (role) {
      case "tenant_main_admin":
        return "default";
      case "tenant_admin":
        return "secondary";
      default:
        return "outline";
    }
  }

  function getRoleLabel(role: string) {
    switch (role) {
      case "tenant_main_admin":
        return "Main Admin";
      case "tenant_admin":
        return "Admin";
      default:
        return role;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <Button size="sm" onClick={onAddUser}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "tenant_main_admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.id !== currentUserId &&
                          user.role === "tenant_admin" &&
                          currentUserRole === "tenant_main_admin" && (
                            <DropdownMenuItem onClick={() => handleTransferOwnership(user.id)}>
                              <ArrowRightLeft className="w-4 h-4 mr-2" />
                              Transfer Ownership
                            </DropdownMenuItem>
                          )}
                        {user.id !== currentUserId && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">No team members yet</div>
        )}
      </div>
    </div>
  );
}
