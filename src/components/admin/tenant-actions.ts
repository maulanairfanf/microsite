'use server';

import { archiveTenant, restoreTenant } from '@/lib/db/tenants';
import { revalidatePath } from 'next/cache';

export async function archiveTenantAction(tenantId: string) {
  await archiveTenant(tenantId);
  revalidatePath('/super/tenants');
}

export async function restoreTenantAction(tenantId: string) {
  await restoreTenant(tenantId);
  revalidatePath('/super/tenants');
}