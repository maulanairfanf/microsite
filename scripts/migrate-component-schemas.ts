#!/usr/bin/env tsx
import { prisma } from '../src/lib/prisma';
import { COMPONENT_SCHEMAS } from '../src/lib/components/schemas';
import { ComponentName } from '../src/lib/components/componentNames';
import { COMPONENT_DISPLAY_NAMES } from '../src/lib/components/displayNames';

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');
const FORCE = process.argv.includes('--force');

function log(message: string) {
  if (VERBOSE) console.log(`  ${message}`);
}

async function main() {
  console.log(`[migrate-component-schemas] ${DRY_RUN ? 'DRY RUN' : 'LIVE RUN'}`);
  console.log('');

  const existingComponents = await prisma.component.findMany();
  const changes: Array<{ action: string; name: string; detail: string }> = [];

  // Build a map: canonical name -> existing component row (prefer one with schema)
  // We treat Hero/Hero and hero/hero as different names, but if both exist, we
  // need to keep the one matching the canonical name (per ComponentName const).
  const canonicalByName: Record<string, { id: string; configSchema: string | null }> = {};
  for (const name of Object.keys(COMPONENT_SCHEMAS)) {
    const match = existingComponents.find((c) => c.name === name);
    if (match) canonicalByName[name] = { id: match.id, configSchema: match.configSchema };
  }

  // Step 1: Find ALL components with the same name (case-insensitive) and decide which to keep
  const byNormalizedName: Record<string, Array<{ id: string; name: string; configSchema: string | null; displayName: string | null }>> = {};
  for (const c of existingComponents) {
    const norm = c.name.toLowerCase();
    if (!byNormalizedName[norm]) byNormalizedName[norm] = [];
    byNormalizedName[norm].push(c);
  }

  for (const [normName, components] of Object.entries(byNormalizedName)) {
    if (components.length > 1) {
      // Strategy: prefer the one with the most sections (has the real data)
      // Then prefer canonical with schema > any with schema > canonical > first
      const canonicalName = Object.keys(COMPONENT_SCHEMAS).find(
        (n) => n.toLowerCase() === normName,
      );
      const withSchema = components.find((c) => c.configSchema !== null);
      const canonical = components.find((c) => c.name === canonicalName);

      // Count sections for each candidate
      const withCounts = await Promise.all(
        components.map(async (c) => ({
          ...c,
          sectionCount: await prisma.section.count({ where: { componentId: c.id } }),
        })),
      );
      const withSections = withCounts.filter((c) => c.sectionCount > 0);
      const mostUsed = withCounts.reduce((a, b) => (b.sectionCount > a.sectionCount ? b : a));

      // Priority: most-used canonical > most-used > canonical with schema > with schema > canonical > first
      const keep =
        (canonical && canonical.id === mostUsed.id ? canonical : null) ||
        mostUsed ||
        (canonical && canonical.configSchema !== null ? canonical : null) ||
        withSchema ||
        canonical ||
        components[0];

      for (const dup of components) {
        if (dup.id === keep.id) continue;
        const dupCount = withCounts.find((c) => c.id === dup.id)?.sectionCount ?? 0;
        if (dupCount > 0) {
          changes.push({
            action: 'REASSIGN',
            name: dup.name,
            detail: `${dupCount} section(s) → ${keep.name} (${keep.id})`,
          });
        }
        changes.push({ action: 'DELETE', name: dup.name, detail: 'duplicate' });
      }

      // Track rename if kept name differs from canonical
      if (keep && canonicalName && keep.name !== canonicalName) {
        changes.push({
          action: 'RENAME',
          name: keep.name,
          detail: `→ ${canonicalName}`,
        });
      }
    }
  }

  // Step 2: Plan schema + displayName updates
  for (const [name, configSchema] of Object.entries(COMPONENT_SCHEMAS)) {
    const existing = existingComponents.find((c) => c.name === name);
    const displayName = COMPONENT_DISPLAY_NAMES[name] ?? null;
    if (existing) {
      if (existing.configSchema !== configSchema) {
        changes.push({ action: 'UPDATE', name, detail: 'configSchema changed' });
      } else {
        log(`No schema change needed for: ${name}`);
      }
      if (existing.displayName !== displayName) {
        changes.push({ action: 'UPDATE', name, detail: `displayName → "${displayName}"` });
      } else {
        log(`No displayName change needed for: ${name}`);
      }
    } else {
      changes.push({ action: 'CREATE', name, detail: 'new component' });
    }
  }

  if (changes.length === 0) {
    console.log('[OK] All components already in sync. Nothing to do.');
    return;
  }

  console.log('Planned changes:');
  for (const change of changes) {
    console.log(`  [${change.action}] ${change.name} — ${change.detail}`);
  }
  console.log('');

  if (DRY_RUN) {
    console.log('[DRY RUN] No changes applied. Re-run without --dry-run to apply.');
    return;
  }

  if (!FORCE) {
    console.log('Add --force to apply these changes.');
    return;
  }

  // Step 3: Apply changes in a transaction
  await prisma.$transaction(async (tx) => {
    // Reassign sections from duplicate components to canonical ones
    for (const [normName, components] of Object.entries(byNormalizedName)) {
      if (components.length > 1) {
        const canonicalName = Object.keys(COMPONENT_SCHEMAS).find(
          (n) => n.toLowerCase() === normName,
        );
        const withSchema = components.find((c) => c.configSchema !== null);
        const canonical = components.find((c) => c.name === canonicalName);

        // Re-count sections inside the transaction
        const withCounts = await Promise.all(
          components.map(async (c) => ({
            ...c,
            sectionCount: await tx.section.count({ where: { componentId: c.id } }),
          })),
        );
        const mostUsed = withCounts.reduce((a, b) => (b.sectionCount > a.sectionCount ? b : a));

        const keep =
          (canonical && canonical.id === mostUsed.id ? canonical : null) ||
          mostUsed ||
          (canonical && canonical.configSchema !== null ? canonical : null) ||
          withSchema ||
          canonical ||
          components[0];

        for (const dup of components) {
          if (dup.id === keep.id) continue;
          const dupCount = withCounts.find((c) => c.id === dup.id)?.sectionCount ?? 0;
          if (dupCount > 0) {
            await tx.section.updateMany({
              where: { componentId: dup.id },
              data: { componentId: keep.id },
            });
            log(`  ✓ Reassigned ${dupCount} section(s): ${dup.id} → ${keep.id}`);
          }
          await tx.component.delete({ where: { id: dup.id } });
          log(`  ✓ Deleted duplicate: ${dup.name} (${dup.id})`);
        }

        // If kept component's name differs from canonical, rename it
        if (keep && canonicalName && keep.name !== canonicalName) {
          await tx.component.update({
            where: { id: keep.id },
            data: { name: canonicalName },
          });
          log(`  ✓ Renamed: ${keep.name} → ${canonicalName}`);
        }
      }
    }

    // Upsert all 7 components with schema + displayName
    for (const [name, configSchema] of Object.entries(COMPONENT_SCHEMAS)) {
      const displayName = COMPONENT_DISPLAY_NAMES[name] ?? null;
      await tx.component.upsert({
        where: { name },
        update: { configSchema, displayName },
        create: { name, configSchema, displayName },
      });
      log(`  ✓ Upserted: ${name} (displayName: "${displayName}")`);
    }
  });

  console.log('');
  console.log('[OK] Migration complete.');

  // Step 4: Final verification
  const finalComponents = await prisma.component.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, displayName: true, configSchema: true },
  });

  console.log('');
  console.log('Final state:');
  for (const c of finalComponents) {
    const len = c.configSchema ? c.configSchema.length : 0;
    const label = c.displayName ?? c.name;
    console.log(`  ${c.name.padEnd(20)} | ${label.padEnd(20)} | schema=${len} chars`);
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
