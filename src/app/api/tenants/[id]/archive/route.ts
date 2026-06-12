import { NextRequest, NextResponse } from "next/server";
import { archiveTenant, getTenant } from "@/lib/db/tenants";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
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

    if (tenant.status === "archived") {
      return NextResponse.json(
        { error: "Tenant is already archived" },
        { status: 400 },
      );
    }

    await archiveTenant(id);

    return NextResponse.json({
      success: true,
      message: "Tenant archived successfully",
    });
  } catch (error: any) {
    console.error("POST /api/tenants/[id]/archive error:", error);
    return NextResponse.json({ error: "Failed to archive tenant" }, { status: 500 });
  }
}
