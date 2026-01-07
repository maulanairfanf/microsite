"use server";

import { ComponentRenderer } from "@/components/ComponentRenderer";
import { loadTenantSections } from "@/lib/tenantLoader";
import { redirect } from "next/navigation";

export default async function TenantPage({ 
  params, 
}: { 
  params: Promise<{ tenant: string[] }> 
}) {
  const { tenant } = await params;
  
  // Redirect to home if tenant path is empty
  if (!tenant || tenant.length === 0) {
    redirect("/");
  }

  const sections = loadTenantSections(tenant);
  return (
    <main className="min-h-screen bg-gray-200 flex items-start justify-center py-0 md:pt-8">
      <div className="w-full max-w-lg bg-gray-100 shadow-2xl md:rounded-t-3xl overflow-hidden">
        {sections?.map((component: any, index: number) => (
          <ComponentRenderer key={component.id ?? index} component={component} />
        ))}
      </div>
    </main>
  );
}
