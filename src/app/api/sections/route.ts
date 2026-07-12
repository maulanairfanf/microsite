import { NextRequest, NextResponse } from "next/server";
import {
  listSections,
  createSection,
  countHeroSectionsForTenant,
} from "@/lib/db/sections";
import { getComponent } from "@/lib/db/components";
import { ComponentName } from "@/lib/components/componentNames";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || undefined;

    const sections = await listSections({ tenantId });

    return NextResponse.json({ data: sections });
  } catch (error) {
    console.error("GET /api/sections error:", error);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, componentId, order, configJson } = body;

    if (!tenantId || !componentId) {
      return NextResponse.json(
        { error: "Missing required fields: tenantId, componentId" },
        { status: 400 },
      );
    }

    const component = await getComponent(componentId);
    if (component?.name === ComponentName.Hero) {
      const existing = await countHeroSectionsForTenant(tenantId);
      if (existing > 0) {
        return NextResponse.json(
          { error: "You can only have one Hero section per tenant." },
          { status: 409 },
        );
      }
    }

    const section = await createSection({
      tenantId,
      componentId: componentId || null,
      order: order || 0,
      configJson,
    });

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/sections error:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}
