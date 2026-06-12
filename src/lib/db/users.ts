import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export type { User };

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: string;
  tenantId?: string;
}): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || "tenant",
      tenantId: data.tenantId,
    },
  });
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    name: string;
    role: string;
    tenantId: string;
  }>,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function updateUserPassword(id: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}
