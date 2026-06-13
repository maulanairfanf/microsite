import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function SuperLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "super_admin") {
    redirect("/login");
  }

  return (
    <AdminShell
      role={session.role}
      userName={session.name}
      userEmail={session.email}
      isImpersonating={false}
    >
      {children}
    </AdminShell>
  );
}
