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

export interface Section {
  id: string;
  tenantId: string;
  component: string;
  order: number;
  configJson: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Component {
  id: string;
  name: string;
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