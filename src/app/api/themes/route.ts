import { NextRequest, NextResponse } from "next/server";
import { listThemes, createTheme } from "@/lib/db/themes";
import { getSession } from "@/lib/auth";
import { validateTheme } from "@/lib/themeValidator";
import { defaultTokens } from "@/lib/themeDefaults";

export async function GET() {
  try {
    const themes = await listThemes();

    return NextResponse.json({ data: themes });
  } catch (error) {
    console.error("GET /api/themes error:", error);
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized: super admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, slug, fontFamily, theme: tokens } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields: name, slug" }, { status: 400 });
    }

    const validationData = {
      name,
      slug,
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

    const theme = await createTheme({
      name: validation.data!.name,
      slug: validation.data!.slug,
      config: configJson,
    });

    return NextResponse.json({ data: theme }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/themes error:", error);
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 });
  }
}
