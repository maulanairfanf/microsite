import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only tenant_main_admin can transfer ownership
    if (session.role !== "tenant_main_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Target user must be in the same tenant
    if (targetUser.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "User not in same tenant" }, { status: 403 });
    }

    // Target user must be tenant_admin (cannot transfer to tenant_main_admin)
    if (targetUser.role !== "tenant_admin") {
      return NextResponse.json(
        { error: "Can only transfer ownership to tenant_admin" },
        { status: 400 },
      );
    }

    // Update current owner's role to tenant_admin
    await prisma.user.update({
      where: { id: session.userId },
      data: { role: "tenant_admin" },
    });

    // Update target user to tenant_main_admin
    await prisma.user.update({
      where: { id: userId },
      data: { role: "tenant_main_admin" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/users/transfer-ownership error:", error);
    return NextResponse.json({ error: "Failed to transfer ownership" }, { status: 500 });
  }
}
