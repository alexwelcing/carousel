/**
 * Build-time résumé generation.
 * Renders one base résumé (public/resume.pdf) plus one tailored résumé per role
 * (public/resumes/<slug>.pdf) so downloads are static, instant, and CDN-cached —
 * no client-side PDF rendering or font fetching at runtime.
 *
 * Runs before `vite build` (see package.json "build" script), so the generated
 * files land in public/ and get copied into dist/.
 */
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';
import ResumePDFDocument, { type Wordmark } from '../src/components/ResumePDF';
import ResumePlainPDFDocument from '../src/components/ResumePlainPDF';
import { applicationPacketOverrides } from '../src/data/applicationPackets';
import { getAnonymousPacketBasePath, getAnonymousShareId } from '../src/lib/shareLinks';
import type { TailoredRole } from '../src/data/roles';
import { roles } from '../src/data/roles';
import { computeScale, computeWordmark } from './pretext-fit';

const wordmark: Wordmark = await computeWordmark();

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '../public');
const resumesDir = resolve(publicDir, 'resumes');
const coverLettersDir = resolve(publicDir, 'cover-letters');
const applicationPacketsDir = resolve(publicDir, 'applications');

await mkdir(resumesDir, { recursive: true });
await mkdir(coverLettersDir, { recursive: true });
await mkdir(applicationPacketsDir, { recursive: true });

const pageCount = (buf: Buffer) =>
  (buf.toString('latin1').match(/\/Type\s*\/Page(?![s])/g) || []).length;

type Props = { role?: TailoredRole; theme?: 'dark' | 'light'; scale: number };
const render = (p: Props) => renderToBuffer(createElement(ResumePDFDocument, { ...p, wordmark }));

/**
 * Pretext gives the starting fill estimate; we then render-and-verify with the
 * real engine, stepping down until the page genuinely fits. Returns the dark
 * buffer at the winning scale + the scale itself.
 */
async function fitDark(role: TailoredRole | undefined) {
  let scale = await computeScale(role);
  let buf = await render({ role, scale });
  while (pageCount(buf) > 1 && scale > 0.9) {
    scale = Math.round((scale - 0.04) * 1000) / 1000;
    buf = await render({ role, scale });
  }
  return { scale, buf };
}

let count = 0;

async function emit(role: TailoredRole | undefined, darkPath: string, lightPath: string) {
  const { scale, buf } = await fitDark(role);
  const light = await render({ role, theme: 'light', scale });
  await writeFile(darkPath, buf);
  await writeFile(lightPath, light);
  count += 2;
  console.log(`[resumes] ${role ? role.slug : 'base'} → fit scale ${scale}`);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitStructuredItems(value: string, limit = 3): string[] {
  const normalized = (value || '').replace(/\r/g, '');
  const lineItems = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

  if (lineItems.length > 1) {
    return lineItems.slice(0, limit);
  }

  return normalized
    .split(/;|,(?=\s+[A-Z0-9])|,(?=\s+(?:AI|LLM|APIs?|RAG|SAML|OIDC|SOC2)\b)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function clampSentence(value: string, fallback: string): string {
  const text = (value || '').replace(/\s+/g, ' ').trim();
  return text.length > 0 ? text : fallback;
}

function sanitizeLeadAngle(value: string): string {
  let text = clampSentence(value, 'I translate AI strategy into shipped products with measurable outcomes.');
  text = text
    .replace(/^(this is )?a?\s*bullseye\s*[—-]\s*/i, '')
    .replace(/^(arguably the )?strongest fit in the batch\s*[-—]\s*/i, '')
    .replace(/^(strongest [^.]+ match\s*[—-]\s*)/i, '')
    .replace(/^(same bullseye angle\s*[—-]\s*)/i, '')
    .replace(/^(lead unapologetically with|lead hard with|lead with|emphasize|frame|pitch|position)\s+/i, '')
    .trim();

  if (/^manatt\s+document-ai\b/i.test(text)) {
    text = text.replace(
      /^manatt\s+document-ai\s*\(([^)]+)\)\s+as\s+a\s+direct\s+analog\s+to\s+(.+)$/i,
      'My document-AI work at Manatt, especially $1, is directly relevant to $2',
    );
    text = text.replace(/^manatt\s+document-ai\s+/i, 'My document-AI work at Manatt is ');
  } else if (/^manatt\b/i.test(text)) {
    text = `My work at ${text}`;
  } else if (!/^i\b/i.test(text) && !/^my\b/i.test(text)) {
    text = `I bring experience ${text}`;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeUrl(...candidates: Array<string | undefined>): string {
  for (const candidate of candidates) {
    const value = (candidate || '').trim();
    if (!value || value === '#' || /^open$/i.test(value) || /^n\/?a$/i.test(value) || /^tbd$/i.test(value)) {
      continue;
    }
    if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) {
      return value;
    }
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(value)) {
      return `https://${value}`;
    }
  }
  return '#';
}

type ProofPoint = {
  point: string;
  detail: string;
};

const BASE_PROOF_LIBRARY: ProofPoint[] = [
  {
    point: 'Multi-agent systems built end to end',
    detail: 'CreateSuite: autonomous agents with persistence, inter-agent messaging, and six model providers running in one orchestration layer.',
  },
  {
    point: 'Enterprise deployment and trust',
    detail: 'Law Business Research: 150+ enterprise SSO integrations and identity systems serving high-trust legal customers at scale.',
  },
  {
    point: 'Document and knowledge-work AI',
    detail: 'Manatt: AI document scanning and knowledge-graph improvements for legal publishing workflows where precision mattered.',
  },
  {
    point: 'Platform and developer-tooling product work',
    detail: 'Obsess and internal platform work: built developer-facing systems, APIs, and product surfaces that other teams depended on.',
  },
  {
    point: 'Hands-on product plus engineering range',
    detail: 'Architect PM who prototypes in TypeScript and Python, ships production systems, and closes the loop with customers.',
  },
];

function pickProofPoints(role: CsvTargetRole, topTarget: CsvTopTarget | undefined): ProofPoint[] {
  const signal = `${role['Role Title']} ${role['Fit to Alex']} ${role['Positioning Angle']} ${topTarget?.['Lead Angle for Resume/Cover Letter'] || ''}`.toLowerCase();
  const selected: ProofPoint[] = [];

  const include = (proof: ProofPoint) => {
    if (!selected.some((item) => item.point === proof.point)) selected.push(proof);
  };

  if (/(agent|llm|ai|model|langsmith|observability)/.test(signal)) include(BASE_PROOF_LIBRARY[0]);
  if (/(identity|security|authorization|auth|regulated|bank|fraud|governance)/.test(signal)) include(BASE_PROOF_LIBRARY[1]);
  if (/(document|legal|claims|knowledge|retrieval|search|studio)/.test(signal)) include(BASE_PROOF_LIBRARY[2]);
  if (/(platform|developer|api|dx|infrastructure|tooling)/.test(signal)) include(BASE_PROOF_LIBRARY[3]);
  include(BASE_PROOF_LIBRARY[4]);

  for (const proof of BASE_PROOF_LIBRARY) {
    if (selected.length >= 3) break;
    include(proof);
  }

  return selected.slice(0, 3);
}

type CsvTargetRole = {
  Fit: string;
  Company: string;
  'Role Title': string;
  Location: string;
  Type: string;
  'Comp Benchmark': string;
  'Key Requirements': string;
  'Fit to Alex': string;
  'Positioning Angle': string;
  Stage?: string;
  Funding?: string;
  'AI Focus'?: string;
  'Job URL'?: string;
};

type CsvCompanyProfile = {
  Company: string;
  Stage: string;
  'Funding / Backing': string;
  'AI Focus': string;
  Website?: string;
};

type CsvTopTarget = {
  Rank: string;
  Company: string;
  'Role Title': string;
  'Lead Angle for Resume/Cover Letter': string;
  'Job URL'?: string;
};

function parseCsvFile<T>(path: string): T[] {
  const content = readFileSync(path, 'utf-8');
  return parseCsv(content, {
    columns: true,
    skip_empty_lines: true,
  }) as T[];
}

function buildTailoredRole(
  role: CsvTargetRole,
  company: CsvCompanyProfile | undefined,
  topTarget: CsvTopTarget | undefined,
): TailoredRole {
  const keyRequirements = splitStructuredItems(role['Key Requirements'], 3);
  const proofPoints = pickProofPoints(role, topTarget);
  const primaryLead = sanitizeLeadAngle(
    topTarget?.['Lead Angle for Resume/Cover Letter'] || role['Positioning Angle'],
  );

  const headline = `${role.Company}: ${primaryLead.slice(0, 112)}${primaryLead.length > 112 ? '…' : ''}`;
  const intro = clampSentence(
    role['Fit to Alex'],
    'Product-minded engineer shipping AI systems from strategy to production code.',
  );

  const roleSlug = slugify(`${role.Company}-${role['Role Title']}`);

  return {
    slug: roleSlug,
    company: role.Company,
    roleTitle: role['Role Title'],
    location: role.Location || 'Remote',
    applyUrl: normalizeUrl(role['Job URL'], topTarget?.['Job URL'], company?.Website),
    tagline: `[ AI PROSPECT · ${(role.Type || 'Hybrid').toUpperCase()} ]`,
    headline,
    intro,
    whyFit: [
      {
        point: proofPoints[0]?.point || keyRequirements[0] || 'AI product execution',
        detail: proofPoints[0]?.detail || intro,
      },
      {
        point: proofPoints[1]?.point || keyRequirements[1] || 'Enterprise-scale delivery',
        detail: proofPoints[1]?.detail || 'Delivered secure enterprise integrations and production-grade systems.',
      },
      {
        point: keyRequirements[0] || keyRequirements[2] || 'Role-specific leadership',
        detail: primaryLead,
      },
    ],
    proof: [
      ...proofPoints.map((proof) => proof.point),
    ],
  };
}

function buildCoverLetter(role: TailoredRole): string {
  const [w1, w2, w3] = role.whyFit;
  const override = applicationPacketOverrides[role.slug];
  const proofIntro = role.proof.length > 0
    ? `The strongest proof for this application is that I have already done adjacent work across ${role.proof.join(', ')}.`
    : 'The strongest proof for this application is that I already operate at the intersection of product, engineering, and AI delivery.';
  return [
    `Hiring Team at ${role.company}`,
    '',
    `I am applying for the ${role.roleTitle} role (${role.location}).`,
    '',
    `My pitch for this role is simple: ${override?.coverLetterLead || w3.detail}`,
    '',
    `${role.intro}`,
    '',
    proofIntro,
    '',
    'Why I am a strong fit:',
    `- ${w1.point}: ${w1.detail}`,
    `- ${w2.point}: ${w2.detail}`,
    `- ${w3.point}: ${w3.detail}`,
    '',
    'Selected proof points:',
    `- ${role.proof[0] || 'Built and shipped at enterprise scale'}`,
    `- ${role.proof[1] || 'Hands-on product and engineering delivery'}`,
    `- ${role.proof[2] || 'AI systems in production with measurable outcomes'}`,
    ...(override?.recruiterNote ? ['', `Note: ${override.recruiterNote}`] : []),
    '',
    'I would welcome the opportunity to discuss how I can contribute quickly, operate with high autonomy, and ship for this team.',
    '',
    'Best regards,',
    'Alex Welcing',
    'alexwelcing@gmail.com',
    'https://github.com/alexwelcing',
    'https://linkedin.com/in/alexwelcing',
  ].join('\n');
}

type ApplicationPacket = {
  slug: string;
  shareId: string;
  sharePath: string;
  company: string;
  roleTitle: string;
  location: string;
  applyUrl: string;
  resumePdf: string;
  resumeLightPdf: string;
  coverLetterTxt: string;
  source: 'curated-role' | 'top-target';
};

const packets: ApplicationPacket[] = [];

async function emitPacket(role: TailoredRole, source: ApplicationPacket['source']) {
  const dark = `resumes/${role.slug}.pdf`;
  const light = `resumes/${role.slug}-light.pdf`;
  const letter = `cover-letters/${role.slug}.txt`;
  const shareId = getAnonymousShareId(role.slug);
  const anonymousBasePath = getAnonymousPacketBasePath(role.slug);
  const anonymousDir = resolve(publicDir, anonymousBasePath.slice(1));
  const anonymousResume = resolve(anonymousDir, 'resume.pdf');
  const anonymousResumeLight = resolve(anonymousDir, 'resume-light.pdf');
  const anonymousCoverLetter = resolve(anonymousDir, 'cover-letter.txt');

  await emit(role, resolve(publicDir, dark), resolve(publicDir, light));
  await writeFile(resolve(publicDir, letter), buildCoverLetter(role), 'utf-8');
  await mkdir(anonymousDir, { recursive: true });
  await copyFile(resolve(publicDir, dark), anonymousResume);
  await copyFile(resolve(publicDir, light), anonymousResumeLight);
  await copyFile(resolve(publicDir, letter), anonymousCoverLetter);

  packets.push({
    slug: role.slug,
    shareId,
    sharePath: anonymousBasePath,
    company: role.company,
    roleTitle: role.roleTitle,
    location: role.location,
    applyUrl: role.applyUrl,
    resumePdf: `${anonymousBasePath}/resume.pdf`,
    resumeLightPdf: `${anonymousBasePath}/resume-light.pdf`,
    coverLetterTxt: `${anonymousBasePath}/cover-letter.txt`,
    source,
  });
}

// Plain, conventional one-page variant (US Letter, Helvetica) — its own pipeline.
const plainBuf = await renderToBuffer(createElement(ResumePlainPDFDocument, {}));
await writeFile(resolve(publicDir, 'resume-plain.pdf'), plainBuf);
count += 1;
console.log(`[resumes] plain → ${pageCount(plainBuf)} page(s)`);

// Base
await emit(undefined, resolve(publicDir, 'resume.pdf'), resolve(publicDir, 'resume-light.pdf'));
// Per role
for (const role of roles) {
  await emitPacket(role, 'curated-role');
}

// Top-target prospects from CSV (new data integration)
const targetRoles = parseCsvFile<CsvTargetRole>(resolve(here, '../LinkedIn_Promoted_Roles_RESEARCH - Target Roles.csv'));
const companyProfiles = parseCsvFile<CsvCompanyProfile>(resolve(here, '../LinkedIn_Promoted_Roles_RESEARCH - Company Profiles.csv'));
const topTargets = parseCsvFile<CsvTopTarget>(resolve(here, '../LinkedIn_Promoted_Roles_RESEARCH - Top Targets.csv'));

const companyMap = new Map(companyProfiles.map((c) => [c.Company.toLowerCase(), c]));
const topTargetMap = new Map(topTargets.map((t) => [`${t.Company}||${t['Role Title']}`.toLowerCase(), t]));

for (const target of topTargets) {
  const match = targetRoles.find(
    (r) => r.Company === target.Company && r['Role Title'] === target['Role Title'],
  );
  if (!match) continue;

  const role = buildTailoredRole(
    match,
    companyMap.get(match.Company.toLowerCase()),
    topTargetMap.get(`${match.Company}||${match['Role Title']}`.toLowerCase()),
  );

  // Avoid overriding hand-curated role packets.
  if (packets.some((p) => p.slug === role.slug)) continue;
  await emitPacket(role, 'top-target');
}

await writeFile(
  resolve(applicationPacketsDir, 'manifest.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: packets.length,
      packets,
    },
    null,
    2,
  ),
  'utf-8',
);

console.log(`[resumes] done — ${count} PDFs generated and ${packets.length} application packets emitted.`);
