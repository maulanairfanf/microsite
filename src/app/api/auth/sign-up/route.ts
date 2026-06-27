import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/db/users";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { setSession } from "@/lib/auth";
import { Plan, Role } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ComponentName } from "@/lib/components/componentNames";
import { HERO_SCHEMA } from "@/lib/components/schemas";
import { isValidSlug, isReservedSlug } from "@/lib/slug";
import { TenantStatus } from "@/lib/db/tenants";
import {
  generateEmailVerificationToken,
  getEmailVerificationTokenExpiry,
  isEmailConfigured,
  sendVerificationEmail,
} from "@/lib/email";

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "User";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "User";
}

async function sendWelcomeEmail(name: string, email: string, token: string): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("[email] RESEND_API_KEY not configured, skipping verification email");
    return;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verificationUrl = `${appUrl}/api/auth/verify?token=${token}`;
  try {
    await sendVerificationEmail({ to: email, name, verificationUrl });
  } catch (err) {
    console.error("[email] Failed to send verification email:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantId, tenantName } = await request.json();

    if (!email || !password || !tenantId || !tenantName) {
      return NextResponse.json(
        { error: "Email, password, tenant ID, and tenant name are required" },
        { status: 400 },
      );
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof tenantId !== "string" ||
      typeof tenantName !== "string"
    ) {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedTenantId = tenantId.trim().toLowerCase();
    const normalizedTenantName = tenantName.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (!isValidSlug(normalizedTenantId)) {
      return NextResponse.json(
        {
          error:
            "Tenant ID must be 3-40 characters, lowercase letters, numbers, or dashes (cannot start or end with a dash)",
        },
        { status: 400 },
      );
    }

    if (isReservedSlug(normalizedTenantId)) {
      return NextResponse.json(
        { error: "This Tenant ID is reserved. Please choose another." },
        { status: 400 },
      );
    }

    if (normalizedTenantName.length < 2 || normalizedTenantName.length > 80) {
      return NextResponse.json(
        { error: "Tenant name must be between 2 and 80 characters" },
        { status: 400 },
      );
    }

    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const existingTenant = await getTenantByTenantId(normalizedTenantId);
    if (existingTenant) {
      return NextResponse.json(
        { error: "This Tenant ID is already taken. Please choose another." },
        { status: 409 },
      );
    }

    const userName = deriveNameFromEmail(normalizedEmail);
    const verificationToken = generateEmailVerificationToken();
    const verificationExpiresAt = getEmailVerificationTokenExpiry();

    const { user, tenant, heroSectionId } = await prisma.$transaction(async (tx) => {
      const heroComponent = await tx.component.upsert({
        where: { name: ComponentName.Hero },
        update: { configSchema: HERO_SCHEMA },
        create: { name: ComponentName.Hero, configSchema: HERO_SCHEMA },
      });

      const tenantRecord = await tx.tenant.create({
        data: {
          tenantId: normalizedTenantId,
          name: normalizedTenantName,
          status: TenantStatus.Active,
        },
      });

      const userRecord = await tx.user.create({
        data: {
          email: normalizedEmail,
          password: await bcrypt.hash(password, 10),
          name: userName,
          role: Role.TenantMainAdmin,
          tenantId: tenantRecord.id,
          emailVerificationToken: verificationToken,
          emailVerificationTokenExpiresAt: verificationExpiresAt,
        },
      });

      const heroConfig = JSON.stringify({
        title: normalizedTenantName,
        subtitle: "Welcome to my page",
        image: "",
        logo: "",
        cta: { text: "Get Started", url: "#" },
      });

      const heroSection = await tx.section.create({
        data: {
          tenantId: tenantRecord.tenantId,
          componentId: heroComponent.id,
          order: 0,
          configJson: heroConfig,
        },
      });

      return { user: userRecord, tenant: tenantRecord, heroSectionId: heroSection.id };
    });

    const session = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
      tenantId: tenant.tenantId,
      tenantPlan: Plan.Free,
      emailVerified: false,
    };

    await setSession(session);

    void sendWelcomeEmail(user.name, user.email, verificationToken);

    return NextResponse.json({ success: true, session, heroSectionId });
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
  }
}
