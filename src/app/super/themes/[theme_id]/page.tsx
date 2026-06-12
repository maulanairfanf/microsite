import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { getTheme, parseThemeConfig } from "@/lib/db/themes";
import { defaultTokens } from "@/lib/themeDefaults";

interface Props {
  params: Promise<{ theme_id?: string }>;
}

export const dynamic = "force-dynamic";

export default async function ThemeFormPage({ params }: Props) {
  const { theme_id } = await params;
  const isNewTheme = theme_id === "new";
  const isEdit = !!theme_id && !isNewTheme;

  const theme = isEdit ? await getTheme(theme_id!) : null;

  if (isEdit && !theme) {
    return notFound();
  }

  const themeData = theme
    ? parseThemeConfig(theme)
    : {
        id: "preview",
        name: "",
        slug: "",
        fontFamily: "Inter",
        theme: defaultTokens,
      };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Theme" : "Add New Theme"}
        description={
          isEdit
            ? "Customize theme colors, fonts, and visual properties."
            : "Create a new theme for your platform"
        }
      />
      <ThemeEditor theme={themeData} isEdit={isEdit} themeDbId={theme?.id ?? null} />
    </div>
  );
}
