const SHEETS_CONFIG = {
  tenants: {
    sheetId: 'tenants',
    url: process.env.GOOGLE_SHEETS_TENANTS_URL || '',
  },
  sections: {
    sheetId: 'sections',
    url: process.env.GOOGLE_SHEETS_SECTIONS_URL || '',
  },
} as const;

const CACHE_REVALIDATE_SECONDS = parseInt(process.env.GOOGLE_SHEETS_CACHE_SECONDS || '300', 10);

interface SheetRow {
  tenant_id: string;
  name?: string;
  theme_json?: string;
  component?: string;
  order?: string;
  config_json?: string;
}

function parseCSV(csvText: string): SheetRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]);
  const rows: SheetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] || '';
    }

    rows.push(obj as unknown as SheetRow);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

async function fetchSheet(url: string): Promise<SheetRow[]> {
  if (!url) {
    return [];
  }

  const response = await fetch(url, {
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.statusText}`);
  }

  const csvText = await response.text();

  if (csvText.startsWith('<!DOCTYPE') || csvText.startsWith('<html')) {
    throw new Error('Received HTML instead of CSV. Make sure the spreadsheet is published to the web.');
  }

  return parseCSV(csvText);
}

export async function loadTenantsSheet(): Promise<SheetRow[]> {
  return fetchSheet(SHEETS_CONFIG.tenants.url);
}

export async function loadSectionsSheet(): Promise<SheetRow[]> {
  return fetchSheet(SHEETS_CONFIG.sections.url);
}

export async function loadTenantById(tenantId: string): Promise<{
  tenant: SheetRow | null;
  sections: SheetRow[];
} | null> {
  try {
    const [tenants, sections] = await Promise.all([
      loadTenantsSheet(),
      loadSectionsSheet(),
    ]);

    const tenant = tenants.find((t) => t.tenant_id === tenantId) || null;
    const tenantSections = sections
      .filter((s) => s.tenant_id === tenantId)
      .sort((a, b) => {
        const orderA = parseInt(a.order as string, 10) || 0;
        const orderB = parseInt(b.order as string, 10) || 0;
        return orderA - orderB;
      });

    return { tenant, sections: tenantSections };
  } catch (error) {
    console.error('Failed to load tenant from sheets:', error);
    return null;
  }
}

export function parseThemeJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    console.error('Failed to parse theme JSON');
    return null;
  }
}

export function parseConfigJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    console.error('Failed to parse config JSON');
    return null;
  }
}