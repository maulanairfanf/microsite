import { NextRequest, NextResponse } from "next/server";
import { restoreTenant, getTenant, TenantStatus } from "@/lib/db/tenants";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
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

    if (tenant.status === TenantStatus.Active) {
      return NextResponse.json(
        { error: "Tenant is already active" },
        { status: 400 },
      );
    }

    await restoreTenant(id);

    return NextResponse.json({
      success: true,
      message: "Tenant restored successfully",
    });
  } catch (error: any) {
    console.error("POST /api/tenants/[id]/restore error:", error);
    return NextResponse.json({ error: "Failed to restore tenant" }, { status: 500 });
  }
}
