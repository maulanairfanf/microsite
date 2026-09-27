import { HalamankuLanding } from "@/components/landing/HalamankuLanding";
import { listLandingTenants } from "@/lib/db/tenants";

export default async function HomePage() {
  const tenants = await listLandingTenants();

  return (
    <HalamankuLanding
      landingTenants={tenants.map(({ tenantId, name }) => ({ tenantId, name }))}
    />
  );
}
