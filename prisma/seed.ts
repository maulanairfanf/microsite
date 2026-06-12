import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { HERO_COMPONENT_NAME, HERO_CONFIG_SCHEMA } from '../src/lib/heroDefaults';

async function main() {
  const rootAdminExists = await prisma.user.findUnique({
    where: { email: 'admin@halamanku.id' },
  });

  if (!rootAdminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@halamanku.id',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'root_admin',
      },
    });
    console.log('Root admin created: admin@halamanku.id / admin123');
  } else {
    console.log('Root admin already exists');
  }

  const heroComponent = await prisma.component.upsert({
    where: { name: HERO_COMPONENT_NAME },
    update: { configSchema: HERO_CONFIG_SCHEMA },
    create: { name: HERO_COMPONENT_NAME, configSchema: HERO_CONFIG_SCHEMA },
  });
  console.log(`Hero component upserted: ${heroComponent.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });