import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check access
    if (session.role === Role.TenantMainAdmin && user.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role } = body;

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only super_admin or tenant_main_admin can update users
    if (session.role !== Role.SuperAdmin && session.role !== Role.TenantMainAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // tenant_main_admin can only update users in their own tenant
    if (session.role === Role.TenantMainAdmin && targetUser.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only super_admin can change role to tenant_main_admin
    if (role === Role.TenantMainAdmin && session.role !== Role.SuperAdmin) {
      return NextResponse.json(
        { error: "Only super_admin can assign tenant_main_admin role" },
        { status: 403 },
      );
    }

    const updateData: { name?: string; role?: string } = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cannot delete yourself
    if (session.userId === id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // Only super_admin or tenant_main_admin can delete users
    if (session.role !== Role.SuperAdmin && session.role !== Role.TenantMainAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // tenant_main_admin can only delete users in their own tenant
    if (session.role === Role.TenantMainAdmin && targetUser.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // tenant_main_admin cannot be deleted by tenant_main_admin (only super_admin)
    if (targetUser.role === Role.TenantMainAdmin && session.role !== Role.SuperAdmin) {
      return NextResponse.json(
        { error: "Only super_admin can delete tenant_main_admin" },
        { status: 403 },
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
