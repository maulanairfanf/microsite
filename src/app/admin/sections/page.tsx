import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { DraggableSections } from "@/components/admin/DraggableSections";
import { getSession } from "@/lib/auth";
import { listSections } from "@/lib/db/sections";

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
