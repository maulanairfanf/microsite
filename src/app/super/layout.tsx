import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function SuperLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "super_admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role={session.role}
        tenantName={undefined}
        userName={session.name}
        userEmail={session.email}
        isImpersonating={false}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
