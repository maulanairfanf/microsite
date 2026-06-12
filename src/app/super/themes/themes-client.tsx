"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/components-extended";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeCard } from "./theme-card";

interface Theme {
  id: string;
  name: string;
  slug: string;
  config: string | null;
}

interface ThemesClientProps {
  initialThemes: Theme[];
  tenantCounts: Record<string, number>;
}

export function ThemesClient({ initialThemes, tenantCounts }: ThemesClientProps) {
  const [themes, setThemes] = useState(initialThemes);
  const [error, setError] = useState("");

  function handleDeleted(id: string) {
    setThemes((prev) => prev.filter((t) => t.id !== id));
  }

  function handleError(message: string) {
    setError(message);
    setTimeout(() => setError(""), 5000);
  }

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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            tenantCount={tenantCounts[theme.id] || 0}
            onDeleted={handleDeleted}
            onError={handleError}
          />
        ))}
      </div>
    </div>
  );
}
