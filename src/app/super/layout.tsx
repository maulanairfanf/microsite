import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { getUserById } from "@/lib/db/users";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function SuperLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== Role.SuperAdmin) {
    redirect("/login");
  }

  const user = await getUserById(session.userId);
  const emailVerified = Boolean(user?.emailVerified);

  return (
    <AdminShell
      role={session.role}
      userName={session.name}
      userEmail={session.email}
      isImpersonating={false}
      emailVerified={emailVerified}
    >
      {children}
    </AdminShell>
  );
}
