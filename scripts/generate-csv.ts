import fs from 'fs';
import path from 'path';

const tenantsDir = path.join(process.cwd(), 'src/data/tenants');

function escapeCSV(value: string) {
  if (typeof value !== 'string') {
    return value;
  }
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateTenantsCSV() {
  const tenants = fs.readdirSync(tenantsDir).filter(f =>
    fs.statSync(path.join(tenantsDir, f)).isDirectory()
  );

  const rows = [['tenant_id', 'name', 'theme_json']];

  for (const tenant of tenants) {
    const themePath = path.join(tenantsDir, tenant, 'theme.json');
    const theme = JSON.parse(fs.readFileSync(themePath, 'utf-8'));

    rows.push([
      tenant,
      theme.name,
      JSON.stringify(theme),
    ]);
  }

  return rows.map(row => row.map(escapeCSV).join(',')).join('\n');
}

function generateSectionsCSV() {
  const tenants = fs.readdirSync(tenantsDir).filter(f =>
    fs.statSync(path.join(tenantsDir, f)).isDirectory()
  );

  const rows = [['tenant_id', 'component', 'order', 'config_json']];

  for (const tenant of tenants) {
    const sectionsPath = path.join(tenantsDir, tenant, 'sections.json');
    const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));

    for (const section of sections.sections) {
      rows.push([
        tenant,
        section.type,
        section.id.includes('-') ? section.id.split('-').pop() : '1',
        JSON.stringify(section),
      ]);
    }
  }

  return rows.map(row => row.map(escapeCSV).join(',')).join('\n');
}

fs.writeFileSync(
  path.join(process.cwd(), 'src/data/template/tenants-sample.csv'),
  generateTenantsCSV()
);

fs.writeFileSync(
  path.join(process.cwd(), 'src/data/template/sections-sample.csv'),
  generateSectionsCSV()
);

console.log('CSV files generated successfully!');
console.log('- src/data/template/tenants-sample.csv');
console.log('- src/data/template/sections-sample.csv');