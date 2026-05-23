import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/components-extended";
import { PageHeader } from "@/components/admin/PageHeader";
import { listThemes } from "@/lib/db/themes";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const themes = await listThemes();

  if (themes.length === 0) {
    return (
      <div>
        <PageHeader
          title="Themes"
          description="Manage your themes"
          action={
            <Link href="/super/themes/new">
              <Button>Add Theme</Button>
            </Link>
          }
        />
        <Card className="p-6">
          <EmptyState
            title="No themes yet"
            description="Create your first theme to get started"
            action={
              <Link href="/super/themes/new">
                <Button>Add Theme</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Themes"
        description={`${themes.length} theme${themes.length !== 1 ? "s" : ""} available`}
        action={
          <Link href="/super/themes/new">
            <Button>Add Theme</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((theme) => {
          let pageBg = '#ccc';
          try {
            if (theme.config) {
              const config = JSON.parse(theme.config);
              pageBg = config.page?.background || '#ccc';
            }
          } catch {}
          return (
            <Card key={theme.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: pageBg }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    <p className="text-sm text-gray-500">Slug: {theme.slug}</p>
                  </div>
                </div>
                <Link href={`/super/themes/${theme.id}`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}