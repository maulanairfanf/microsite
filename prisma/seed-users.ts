import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash('tenant123', 10);

  // Get tenant IDs (not tenantId, but the actual id field)
  const nimraTenant = await prisma.tenant.findUnique({ where: { tenantId: 'nimra-running' } });
  const pempekTenant = await prisma.tenant.findUnique({ where: { tenantId: 'pempek-ibu-wati' } });

  if (!nimraTenant || !pempekTenant) {
    console.error('Tenants not found');
    return;
  }

  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant@foo.com' },
    update: {},
    create: {
      email: 'tenant@foo.com',
      password,
      name: 'Tenant Admin Nimra',
      role: 'tenant',
      tenantId: nimraTenant.id,
    },
  });
  console.log('Created/Updated:', tenant1.email, '-> tenant:', nimraTenant.tenantId);

  const tenant2 = await prisma.user.upsert({
    where: { email: 'pempek@foo.com' },
    update: {},
    create: {
      email: 'pempek@foo.com',
      password,
      name: 'Tenant Admin Pempek',
      role: 'tenant',
      tenantId: pempekTenant.id,
    },
  });
  console.log('Created/Updated:', tenant2.email, '-> tenant:', pempekTenant.tenantId);

  const admin = await prisma.user.findUnique({ where: { email: 'admin@halamanku.id' } });
  if (admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.update({
      where: { email: 'admin@halamanku.id' },
      data: { password: hashedPassword },
    });
    console.log('Updated admin password');
  }
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());