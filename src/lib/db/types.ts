export interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  themeId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  config: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Component {
  id: string;
  name: string;
  displayName: string | null;
  configSchema: string | null;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

// ── Section types ─────────────────────────────────────────────────────────────
// Single source of truth for all Section-related shapes.
// Import from "@/lib/db/types" — never redefine locally.

export interface SectionWithComponent {
  id: string;
  tenantId: string;
  order: number;
  configJson: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  component: { id: string; name: string; displayName: string | null } | null;
}

export interface SectionFormSection {
  id: string;
  componentId: string | null;
  component: { id: string; name: string; displayName: string | null } | null;
  order: number;
  configJson?: string;
}

export interface SectionCardItem {
  id: string;
  order: number;
  component: { id: string; name: string; displayName: string | null } | null;
  configJson: string | null;
}

// ── Shared option types ───────────────────────────────────────────────────────
// For Select/dropdown props. Import from "@/lib/db/types" — never use inline literals.

export interface SelectOption {
  value: string;
  label: string;
}

export interface ComponentOption extends SelectOption {
  name: string;
}
