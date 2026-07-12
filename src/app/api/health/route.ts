import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  let dbStatus: "ok" | "error" = "ok";
  let dbError: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : "Unknown database error";
  }

  const healthy = dbStatus === "ok";
  const body = {
    status: healthy ? "ok" : "degraded",
    db: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeMs: process.uptime() * 1000,
    responseMs: Date.now() - startedAt,
    ...(dbError ? { dbError } : {}),
  };

  return NextResponse.json(body, { status: healthy ? 200 : 503 });
}
