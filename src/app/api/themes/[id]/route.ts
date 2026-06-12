import { NextRequest, NextResponse } from "next/server";
import {
  getTheme,
  updateTheme,
  deleteTheme,
  countTenantsUsingTheme,
} from "@/lib/db/themes";
import { getSession } from "@/lib/auth";
import { validateTheme } from "@/lib/themeValidator";
import { defaultTokens } from "@/lib/themeDefaults";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const theme = await getTheme(id);

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({ data: theme });
  } catch (error) {
    console.error("GET /api/themes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized: super admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, fontFamily, theme: tokens } = body;

    const existing = await getTheme(id);
    if (!existing) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const validationData = {
      name: name || existing.name,
      slug: slug || existing.slug,
      fontFamily: fontFamily || "Inter",
      theme: {
        page: tokens?.page || defaultTokens.page,
        container: tokens?.container || defaultTokens.container,
        card: tokens?.card || defaultTokens.card,
      },
    };

    const validation = validateTheme(validationData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 },
      );
    }

    const configJson = JSON.stringify({
      page: validation.data!.theme.page,
      container: validation.data!.theme.container,
      card: validation.data!.theme.card,
      fontFamily: validation.data!.fontFamily,
    });

    const theme = await updateTheme(id, {
      name: validation.data!.name,
      config: configJson,
    });

    return NextResponse.json({ data: theme });
  } catch (error: any) {
    console.error("PUT /api/themes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized: super admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const theme = await getTheme(id);
    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const inUse = await countTenantsUsingTheme(id);
    if (inUse > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete: ${inUse} tenant${inUse === 1 ? "" : "s"} ${inUse === 1 ? "is" : "are"} using this theme. Switch ${inUse === 1 ? "their" : "their"} theme first.`,
        },
        { status: 409 },
      );
    }

    await deleteTheme(id);

    return NextResponse.json({
      success: true,
      message: "Theme deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/themes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 });
  }
}
