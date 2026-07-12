import { NextRequest, NextResponse } from "next/server";
import { getTenant, updateTenant, deleteTenant, TenantStatus } from "@/lib/db/tenants";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const tenant = await getTenant(id);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ data: tenant });
  } catch (error) {
    console.error("GET /api/tenants/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch tenant" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const isSuperAdmin = session.role === Role.SuperAdmin;
    const isOwnTenant = session.tenantId === id;

    if (!isSuperAdmin && !isOwnTenant) {
      return NextResponse.json(
        { error: "Unauthorized: you can only update your own tenant" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, themeId, showOnLanding } = body;

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name field" }, { status: 400 });
    }

    const tenant = await updateTenant(id, { name, themeId, showOnLanding });

    return NextResponse.json({ data: tenant });
  } catch (error: any) {
    console.error("PUT /api/tenants/[id] error:", error);

    return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.SuperAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: super admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const tenant = await getTenant(id);
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (tenant.status !== TenantStatus.Archived) {
      return NextResponse.json(
        { error: "Only archived tenants can be permanently deleted. Archive it first." },
        { status: 400 },
      );
    }

    await deleteTenant(id);

    return NextResponse.json({
      success: true,
      message: "Tenant permanently deleted",
    });
  } catch (error: any) {
    console.error("DELETE /api/tenants/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete tenant" }, { status: 500 });
  }
}
