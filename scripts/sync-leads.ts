/**
 * Pipeline v2 lead sync: tracker CSV -> src/data/v2/leads.json
 *
 * The job tracker (Google Sheet, "Lauren Leads" tab) is the input of record.
 * The sheet is private, so sync runs wherever authorized access exists (a
 * Cowork session exports the tab to CSV and commits it here). This script
 * normalizes that CSV into leads.json, preserving manual per-lead overrides
 * (track, accent, slug) for rows that already exist.
 *
 * Usage:  tsx scripts/sync-leads.ts data/lauren-leads.csv
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';

const here = dirname(fileURLToPath(import.meta.url));
const leadsPath = resolve(here, '../src/data/v2/leads.json');

type Track = 'identity' | 'agents' | 'enterprise' | 'builder';

interface Lead {
  company: string;
  roleTitle: string;
  location: string;
  applyUrl: string;
  comp?: string;
  track: Track;
  accent?: string;
  status: string;
  slug?: string;
  ats?: string;
  notes?: string;
}

function inferTrack(title: string): Track {
  const t = title.toLowerCase();
  if (/(identity|iam|security|trust|auth|fraud)/.test(t)) return 'identity';
  if (/(agent|ai|llm|ml|forward.deployed|applied)/.test(t)) return 'agents';
  if (/(platform|enterprise|infrastructure|data|principal|director)/.test(t)) return 'enterprise';
  return 'builder';
}

function normStatus(s: string): string {
  const t = (s || '').trim().toLowerCase();
  if (t.includes('submit')) return 'submitted';
  if (t.includes('apply')) return 'to-apply';
  if (t.includes('closed') || t.includes('reject')) return 'closed';
  return t || 'to-apply';
}

const csvFile = process.argv[2];
if (!csvFile) {
  console.error('usage: tsx scripts/sync-leads.ts <lauren-leads.csv>');
  process.exit(1);
}

const rows: Record<string, string>[] = parseCsv(readFileSync(resolve(csvFile), 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
});

const existing: Lead[] = JSON.parse(readFileSync(leadsPath, 'utf-8')).leads;
const bySlugKey = new Map(existing.map((l) => [`${l.company}::${l.roleTitle}`.toLowerCase(), l]));

const merged: Lead[] = [];
let added = 0, kept = 0, skipped = 0;
for (const row of rows) {
  const company = (row.Company || row.company || '').trim();
  const roleTitle = (row['Role Title'] || row.roleTitle || row['Role Applied To'] || '').trim();
  const applyUrl = (row.Link || row['Apply Link'] || row.applyUrl || '').trim();
  if (!company || !roleTitle) { skipped++; continue; }
  if (!/^https?:\/\//.test(applyUrl)) { skipped++; continue; }
  const key = `${company}::${roleTitle}`.toLowerCase();
  const prior = bySlugKey.get(key);
  merged.push({
    company,
    roleTitle,
    location: (row.Location || '').trim() || prior?.location || 'Remote / US',
    applyUrl,
    comp: (row.Comp || row['Comp Range'] || '').trim() || prior?.comp,
    track: prior?.track || inferTrack(roleTitle),
    accent: prior?.accent,
    slug: prior?.slug,
    ats: (row.ATS || '').trim() || prior?.ats,
    notes: (row.Notes || '').trim() || prior?.notes,
    status: normStatus(row.Status || ''),
  });
  prior ? kept++ : added++;
  bySlugKey.delete(key);
}
// keep any manual leads not present in the sheet
for (const leftover of bySlugKey.values()) merged.push(leftover);

const out = {
  comment: 'Input of record for generated application packets. Synced from the job tracker (Lauren Leads). Manual fields (track/accent/slug) survive re-sync.',
  leads: merged,
};
writeFileSync(leadsPath, JSON.stringify(out, null, 2) + '\n', 'utf-8');
console.log(`[sync-leads] ${merged.length} leads (${added} new, ${kept} updated, ${skipped} skipped, ${bySlugKey.size} manual kept)`);
