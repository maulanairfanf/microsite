import { prisma } from "@/lib/prisma";

export interface Component {
  id: string;
  name: string;
  configSchema: string | null;
  createdAt: Date;
}

export async function listComponents(): Promise<Component[]> {
  return prisma.component.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getComponent(id: string): Promise<Component | null> {
  return prisma.component.findUnique({ where: { id } });
}

export async function getComponentByName(name: string): Promise<Component | null> {
  return prisma.component.findUnique({ where: { name } });
}

export async function createComponent(data: {
  name: string;
  configSchema?: string;
}): Promise<Component> {
  return prisma.component.create({
    data: {
      name: data.name,
      configSchema: data.configSchema || null,
    },
  });
}

export async function deleteComponent(id: string): Promise<void> {
  await prisma.component.delete({ where: { id } });
}

export async function upsertComponent(data: {
  name: string;
  configSchema?: string;
}): Promise<Component> {
  return prisma.component.upsert({
    where: { name: data.name },
    update: { configSchema: data.configSchema || null },
    create: {
      name: data.name,
      configSchema: data.configSchema || null,
    },
  });
}
