import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/admin/FormFields";
import { PageHeader } from "@/components/admin/PageHeader";
import { getTheme } from "@/lib/db/themes";
import { createTheme, updateTheme } from "@/lib/db/themes";

interface Props {
  params: Promise<{ theme_id?: string }>;
}

export const dynamic = "force-dynamic";

const emptyThemeJson = `{
  "page": {
    "background": "#ffffff",
    "text": "#000000",
    "headerText": "#000000"
  },
  "container": {
    "background": "#f3f4f6",
    "radius": "16px",
    "border": "0",
    "shadow": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  },
  "card": {
    "background": "#ffffff",
    "hoverBackground": "#f3f4f6",
    "text": "#000000",
    "radius": "8px",
    "border": "0",
    "shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1)"
  }
}`;

async function saveTheme(formData: FormData) {
  "use server";

  const themeId = formData.get("themeId") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const themeJson = formData.get("theme_json") as string;

  if (themeId) {
    await updateTheme(themeId, { name, config: themeJson });
  } else {
    await createTheme({ name, slug, config: themeJson });
  }

  redirect("/super/themes");
}

export default async function ThemeFormPage({ params }: Props) {
  const { theme_id } = await params;
  const isEdit = !!theme_id;

  const theme = isEdit ? await getTheme(theme_id) : null;

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Theme" : "Add New Theme"}
        description={isEdit ? "Update theme configuration" : "Create a new theme for your platform"}
      />
      <Card className="p-6 max-w-2xl">
        <form action={saveTheme}>
          <div className="space-y-4">
            <Input
              name="slug"
              label="Slug"
              placeholder="my-theme"
              defaultValue={theme?.slug}
              required
              disabled={isEdit}
            />

            <Input
              name="name"
              label="Name"
              placeholder="My Theme"
              defaultValue={theme?.name}
              required
            />

            <Textarea
              name="theme_json"
              label="Theme JSON"
              defaultValue={theme?.config || emptyThemeJson}
              required
              className="font-mono text-sm"
              rows={15}
            />
          </div>

          <input type="hidden" name="themeId" value={theme?.id} />

          <div className="flex gap-3 mt-6">
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Theme"}
            </Button>
            <Link href="/super/themes">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}