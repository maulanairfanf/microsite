"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

interface AdminShellProps {
  role: "super_admin" | "tenant_main_admin" | "tenant_admin";
  tenantName?: string;
  userName: string;
  userEmail: string;
  isImpersonating?: boolean;
  children: React.ReactNode;
}

export function AdminShell({
  role,
  tenantName,
  userName,
  userEmail,
  isImpersonating = false,
  children,
}: AdminShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role={role}
        tenantName={tenantName}
        userName={userName}
        userEmail={userEmail}
        isImpersonating={isImpersonating}
        mobileOpen={isMobileNavOpen}
        onMobileOpenChange={setIsMobileNavOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          role={role}
          userName={userName}
          userEmail={userEmail}
          isImpersonating={isImpersonating}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
