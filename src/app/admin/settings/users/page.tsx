import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { UserPageClient } from "@/components/admin/UserPageClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || !session.tenantId) {
    redirect("/login");
  }

  if (session.role !== Role.TenantMainAdmin) {
    redirect("/admin/settings");
  }

  const users = await prisma.user.findMany({
    where: { tenantId: session.tenantId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Serialize dates for client component
  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <UserPageClient
      initialUsers={serializedUsers}
      currentUserId={session.userId}
      currentUserRole={session.role}
    />
  );
}
