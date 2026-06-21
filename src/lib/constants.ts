export const Role = {
  SuperAdmin: "super_admin",
  TenantMainAdmin: "tenant_main_admin",
  TenantAdmin: "tenant_admin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Plan = {
  Free: "free",
  Premium: "premium",
} as const;
export type Plan = (typeof Plan)[keyof typeof Plan];

export interface Session {
  userId: string;
  email: string;
  role: Role;
  name: string;
  tenantId?: string;
  tenantPlan?: Plan;
  emailVerified?: boolean;
  isImpersonating?: boolean;
  originalRole?: Role;
  originalTenantId?: string;
}
