/**
 * Link-freshness pre-flight for the apply loop.
 *
 * Probes every lead whose status is "to-apply" (or --all) and marks dead
 * postings as "posting-closed" so no wave starts against a stale URL.
 *
 * Detection is ATS-aware, learned from 8 dead links across waves 1-3:
 *   - Ashby:      dead postings 200 OK but render "Job not found".
 *   - Greenhouse: dead postings redirect to the board with ?error=true,
 *                 or "no longer active" / Page not found.
 *   - Lever:      dead postings return 404.
 *   - Other:      404/410 = dead; 200 = assumed alive (manual check).
 *
 * Usage:
 *   tsx scripts/check-leads.ts            # to-apply only
 *   tsx scripts/check-leads.ts --all      # every lead
 *   tsx scripts/check-leads.ts --dry      # report only, write nothing
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const leadsPath = resolve(here, '../src/data/v2/leads.json');

interface Lead {
  company: string;
  roleTitle: string;
  applyUrl?: string;
  status?: string;
  freshnessCheckedAt?: string;
  [k: string]: unknown;
}

const ALL = process.argv.includes('--all');
const DRY = process.argv.includes('--dry');
const UA = 'Mozilla/5.0 (compatible; welc.ing lead checker)';

type Verdict = 'alive' | 'dead' | 'unknown';

async function probe(url: string): Promise<{ verdict: Verdict; note: string }> {
  let res: Response;
  try {
    res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA } });
  } catch (e) {
    return { verdict: 'unknown', note: `fetch failed: ${(e as Error).message}` };
  }
  const finalUrl = res.url || url;
  if (res.status === 404 || res.status === 410) return { verdict: 'dead', note: `HTTP ${res.status}` };
  if (!res.ok) return { verdict: 'unknown', note: `HTTP ${res.status}` };
  const body = (await res.text()).slice(0, 200_000);

  if (/ashbyhq\.com/.test(url)) {
    if (/Job not found|The job you requested was not found/i.test(body)) return { verdict: 'dead', note: 'Ashby: job not found' };
    return { verdict: 'alive', note: 'Ashby: job page renders' };
  }
  if (/greenhouse\.io/.test(url)) {
    if (/[?&]error=true/.test(finalUrl)) return { verdict: 'dead', note: 'Greenhouse: error=true redirect' };
    if (/no longer active|Page not found/i.test(body)) return { verdict: 'dead', note: 'Greenhouse: board inactive' };
    if (/Apply for this job|Submit application/i.test(body)) return { verdict: 'alive', note: 'Greenhouse: apply form present' };
    return { verdict: 'unknown', note: 'Greenhouse: no apply form detected' };
  }
  if (/lever\.co/.test(url)) {
    if (/Not found|404/i.test(body) && !/apply/i.test(body)) return { verdict: 'dead', note: 'Lever: not found' };
    return { verdict: 'alive', note: 'Lever: page renders' };
  }
  return { verdict: 'alive', note: `HTTP ${res.status} (generic)` };
}

async function main() {
  const doc = JSON.parse(readFileSync(leadsPath, 'utf-8'));
  const leads: Lead[] = Array.isArray(doc) ? doc : doc.leads;
  const targets = leads.filter((l) => l.applyUrl && (ALL || l.status === 'to-apply'));
  console.log(`Checking ${targets.length} lead(s)...`);

  let dead = 0, alive = 0, unknown = 0;
  for (const lead of targets) {
    const { verdict, note } = await probe(lead.applyUrl!);
    const tag = verdict === 'dead' ? 'DEAD ' : verdict === 'alive' ? 'alive' : 'check';
    console.log(`${tag}  ${lead.company} - ${lead.roleTitle}  (${note})`);
    lead.freshnessCheckedAt = new Date().toISOString().slice(0, 10);
    if (verdict === 'dead') { dead++; if (lead.status === 'to-apply') lead.status = 'posting-closed'; }
    else if (verdict === 'alive') alive++;
    else unknown++;
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nalive=${alive} dead=${dead} unknown=${unknown}`);
  if (!DRY) {
    writeFileSync(leadsPath, JSON.stringify(doc, null, 2) + '\n');
    console.log(`wrote ${leadsPath}`);
  } else {
    console.log('(dry run - nothing written)');
  }
  if (dead > 0) process.exitCode = 2;
}

main();
