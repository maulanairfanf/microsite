import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '../src/lib/constants';
import { ComponentName } from '../src/lib/components/componentNames';
import { COMPONENT_SCHEMAS } from '../src/lib/components/schemas';
import { COMPONENT_DISPLAY_NAMES } from '../src/lib/components/displayNames';
import fs from 'fs';
import path from 'path';

interface SectionData {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface TenantData {
  name: string;
  sections: SectionData[];
  theme: {
    id: string;
    name: string;
    fontFamily: string;
    theme: Record<string, unknown>;
  };
}

function loadTenantData(tenantSlug: string): TenantData | null {
  const basePath = path.join(__dirname, `../src/data/tenants/${tenantSlug}`);
  const tenantPath = path.join(basePath, 'tenant.json');
  const sectionsPath = path.join(basePath, 'sections.json');
  const themePath = path.join(basePath, 'theme.json');

  if (!fs.existsSync(tenantPath) || !fs.existsSync(sectionsPath) || !fs.existsSync(themePath)) {
    return null;
  }

  const tenantMeta: { name: string } = JSON.parse(fs.readFileSync(tenantPath, 'utf-8'));
  const sections: { sections: SectionData[] } = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
  const theme = JSON.parse(fs.readFileSync(themePath, 'utf-8'));

  return { name: tenantMeta.name, sections: sections.sections, theme };
}

async function seedSuperAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@halamanku.id' },
    update: { role: Role.SuperAdmin },
    create: {
      email: 'admin@halamanku.id',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.SuperAdmin,
    },
  });
  console.log('Super admin seeded: admin@halamanku.id / admin123');
}

async function seedAllComponents() {
  for (const [name, configSchema] of Object.entries(COMPONENT_SCHEMAS)) {
    const displayName = COMPONENT_DISPLAY_NAMES[name] ?? null;
    await prisma.component.upsert({
      where: { name },
      update: { configSchema, displayName },
      create: { name, configSchema, displayName },
    });
    console.log(`Component upserted: ${name} (${displayName})`);
  }
}

async function seedSampleTenant(tenantSlug: string): Promise<void> {
  const data = loadTenantData(tenantSlug);
  if (!data) {
    console.warn(`No seed data found for tenant: ${tenantSlug}`);
    return;
  }

  const existingTenant = await prisma.tenant.findUnique({
    where: { tenantId: tenantSlug },
  });
  if (existingTenant) {
    console.log(`Tenant already exists: ${tenantSlug}`);
    return;
  }

  const hashedPassword = await bcrypt.hash('demo1234', 10);
  const tenantEmail = `admin@${tenantSlug}.com`;

  const tenant = await prisma.tenant.create({
    data: {
      tenantId: tenantSlug,
      name: data.name,
      status: 'active',
      plan: 'free',
      showOnLanding: true,
    },
  });

  await prisma.user.create({
    data: {
      email: tenantEmail,
      password: hashedPassword,
      name: data.name,
      role: Role.TenantMainAdmin,
      tenantId: tenant.id,
    },
  });

  const theme = await prisma.theme.upsert({
    where: { slug: data.theme.id },
    update: {},
    create: {
      id: data.theme.id,
      slug: data.theme.id,
      name: data.theme.name,
      config: JSON.stringify(data.theme),
    },
  });

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { themeId: theme.id },
  });

  const componentNames = [...new Set(data.sections.map((s) => s.type))];
  const componentIds: Record<string, string> = {};
  for (const name of componentNames) {
    const component = await prisma.component.findUnique({ where: { name } });
    if (component) {
      componentIds[name] = component.id;
    }
  }

  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    const componentId = componentIds[section.type];
    if (!componentId) continue;

    const { id: _id, type: _type, ...config } = section;
    await prisma.section.create({
      data: {
        tenantId: tenant.tenantId,
        componentId,
        order: i,
        configJson: JSON.stringify(config),
      },
    });
  }

  console.log(`Sample tenant seeded: ${tenantSlug} (${tenantEmail})`);
}

async function main() {
  await seedSuperAdmin();
  await seedAllComponents();
  await seedSampleTenant('coffee-shop');
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
