import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });