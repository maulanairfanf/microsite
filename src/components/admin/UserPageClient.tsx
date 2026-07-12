"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsersTable } from "@/components/admin/UsersTable";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { clientApi } from "@/lib/client-api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | string;
}

interface UserPageClientProps {
  initialUsers: User[];
  currentUserId: string;
  currentUserRole: string;
}

export function UserPageClient({
  initialUsers,
  currentUserId,
  currentUserRole,
}: UserPageClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    try {
      const data = await clientApi.get<{ data: User[] }>("/api/users");
      setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Team Members" description="Manage your team and access permissions" />

      <UsersTable
        users={users}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onRefresh={handleRefresh}
        onAddUser={() => setShowAddDialog(true)}
      />

      <AddUserDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
