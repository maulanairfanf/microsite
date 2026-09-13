import Link from "next/link";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSession } from "@/lib/auth";
import { listSections } from "@/lib/db/sections";

const DraggableSections = dynamic(
  () => import("@/components/admin/DraggableSections").then((mod) => ({ default: mod.DraggableSections })),
  {
    loading: () => <div className="animate-pulse space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg" />)}</div>,
  },
);

export default async function AdminSectionsPage() {
  const session = await getSession();
  const tenantId = session?.tenantId;
  const sections = tenantId ? await listSections({ tenantId }) : [];

  return (
    <div>
      <PageHeader
        title="Sections"
        description="Manage your page sections. Drag to reorder."
        action={
          <Link href="/admin/sections/new">
            <Button>Add Section</Button>
          </Link>
        }
      />

      {sections.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">No sections yet</p>
          <Link href="/admin/sections/new">
            <Button variant="secondary">Create Your First Section</Button>
          </Link>
        </Card>
      ) : (
        <DraggableSections initialSections={sections} tenantId={tenantId || ""} />
      )}
    </div>
  );
}
