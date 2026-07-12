import { NextRequest, NextResponse } from "next/server";
import {
  getSection,
  updateSection,
  deleteSection,
  countHeroSectionsForTenant,
} from "@/lib/db/sections";
import { getComponent } from "@/lib/db/components";
import { ComponentName } from "@/lib/components/componentNames";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const section = await getSection(id);

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json({ data: section });
  } catch (error) {
    console.error("GET /api/sections/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch section" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { componentId, order, configJson } = body;

    const existing = await getSection(id);
    if (!existing) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (componentId) {
      const target = await getComponent(componentId);
      if (
        target?.name === ComponentName.Hero &&
        existing.component?.name !== ComponentName.Hero
      ) {
        const heroCount = await countHeroSectionsForTenant(existing.tenantId, id);
        if (heroCount > 0) {
          return NextResponse.json(
            { error: "You can only have one Hero section per tenant." },
            { status: 409 },
          );
        }
      }
    }

    const section = await updateSection(id, {
      componentId: componentId === undefined ? undefined : componentId || null,
      order,
      configJson,
    });

    return NextResponse.json({ data: section });
  } catch (error: any) {
    console.error("PUT /api/sections/[id] error:", error);

    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = await getSection(id);
    if (!existing) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (existing.component?.name === ComponentName.Hero) {
      return NextResponse.json(
        { error: "Hero section cannot be deleted." },
        { status: 403 },
      );
    }

    await deleteSection(id);

    return NextResponse.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/sections/[id] error:", error);

    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
