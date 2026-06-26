/**
 * Talent Prospecting Data Model  (corrected)
 *
 * Fixes vs. prior version:
 *  - parseRequirements no longer splits on "-" (kept "5–8+ years", "type-safe", "go-to-market" intact)
 *  - videoId is now slugified (commas/slashes/parens stripped) -> safe filenames/URLs
 *  - parseFitPoints / selectProofPoints are implemented (signal-matched), not stubs
 *  - proof library matches the verified ground truth (LBR / Lupine.Live / Manatt / Obsess / flagships)
 *
 * Interfaces are unchanged, so this is a drop-in replacement for src/data/compositionSchema.ts.
 */

/* ── TARGET ROLE ───────────────────────────────────────────────────── */
export interface TargetRole {
  fit: 'A - Strong fit' | 'B - Possible fit' | 'C - Lower fit';
  company: string;
  roleTitle: string;
  location: string;
  type: 'On-site' | 'Hybrid' | 'Remote';
  compLinkedin?: string;
  compBenchmark: string;
  jdSummary: string;
  keyRequirements: string;
  fitToAlex: string;
  positioningAngle: string;
  stage?: string;
  funding?: string;
  aiFocus?: string;
  note?: string;
  jobUrl?: string;
}

/* ── COMPANY PROFILE ───────────────────────────────────────────────── */
export interface CompanyProfile {
  name: string;
  stage: string;
  fundingBacking: string;
  hq: string;
  size: string;
  whatTheyDo: string;
  aiFocus: string;
  recent: string;
  website: string;
  roleCount?: number;
  accentColor?: string;
  logoUrl?: string;
}

/* ── TOP TARGET ────────────────────────────────────────────────────── */
export interface TopTarget {
  rank: number;
  score: number;
  company: string;
  roleTitle: string;
  type: 'On-site' | 'Hybrid' | 'Remote';
  compBenchmark: string;
  whyItFitsAlex: string;
  leadAngle: string;
  jobUrl?: string;
}

/* ── COMPOSITION VARIABLES ─────────────────────────────────────────── */
export interface PitchCompositionVariables {
  companyName: string;
  companyWordmark?: string;
  companyAccent: string;
  roleTitle: string;
  location: string;
  compBenchmark: string;
  fitPoint1: string;
  fitPoint1Evidence: string;
  fitPoint2: string;
  fitPoint2Evidence: string;
  fitPoint3: string;
  fitPoint3Evidence: string;
  requirement1: string;
  requirement1Status: 'checked' | 'highlight';
  requirement2: string;
  requirement2Status: 'checked' | 'highlight';
  requirement3: string;
  requirement3Status: 'checked' | 'highlight';
  proofPoints: Array<{
    title: string;
    description: string;
    stat: string;
    imageUrl?: string;
    accentColor?: string;
  }>;
  ctaText: string;
  ctaButtonText: string;
  ctaUrl: string;
  alexAccent: string;
  videoId: string;
  renderDate: string;
}

export interface ProofPointMapping {
  flagshipSlug: string;
  title: string;
  description: string;
  stat: string;
  relevanceTags: string[];
  fitTags: string[];
}

/* ── SHARED HELPERS (match generate-resumes.tsx) ───────────────────── */

/** URL/file-safe slug: lowercase, & -> and, strip non-alphanumerics. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Split bullet/line lists WITHOUT breaking hyphenated words or numeric ranges. */
export function splitStructuredItems(value: string, limit = 5): string[] {
  const normalized = (value || '').replace(/\r/g, '');
  const lineItems = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (lineItems.length > 1) return lineItems.slice(0, limit);
  // single line: split on semicolons or commas that precede a new capitalised clause
  return normalized
    .split(/;|,(?=\s+[A-Z0-9])|,(?=\s+(?:AI|LLM|APIs?|RAG|SAML|OIDC|SOC2)\b)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, limit);
}

/* ── PROOF LIBRARY (verified ground truth) ─────────────────────────── */
const PROOF_LIBRARY: ProofPointMapping[] = [
  {
    flagshipSlug: 'lupine-science',
    title: 'lupine.science — Scientific Research',
    description: 'Company and research site for the mathematical layer: MLIP benchmarks, phase-change trajectory simulation, and Python scientific-computing pipelines.',
    stat: 'Scientific ML research: MLIP benchmarks and phase-change simulation',
    relevanceTags: ['Materials Science', 'MLIP', 'Machine Learning', 'WebGL', 'Research'],
    fitTags: ['AI/ML PM', 'Research PM', 'Developer Tools', 'Platform PM'],
  },
  {
    flagshipSlug: 'lbr-identity',
    title: 'LBR — Identity & Platform',
    description: 'Re-platformed enterprise identity & subscription at billions of requests/mo; SSO/SAML/OIDC for 150+ AmLaw 200 firms.',
    stat: 'Identity/SSO at billions of requests/mo, 150+ AmLaw 200',
    relevanceTags: ['Identity', 'SSO', 'SAML', 'OIDC', 'Subscription', 'Enterprise'],
    fitTags: ['Identity PM', 'Platform PM', 'Security', 'Fintech'],
  },
  {
    flagshipSlug: 'lbr-workspace',
    title: 'AI API Execution Workspace (LBR)',
    description: 'Type-safe AI API workspace (oRPC) with live introspection and self-improving accuracy across internal APIs.',
    stat: 'Type-safe AI API platform shipped at enterprise scale',
    relevanceTags: ['AI Platform', 'DevTools', 'TypeScript', 'APIs'],
    fitTags: ['Platform PM', 'Developer Tools', 'AI Infra'],
  },
  {
    flagshipSlug: 'manatt',
    title: 'Manatt — Document AI',
    description: 'AI document scanning + knowledge-graph for legal publishing; led IAM for a research platform serving 1,000+ clients.',
    stat: 'Document AI + IAM for 1,000+ legal clients',
    relevanceTags: ['Document AI', 'NLP', 'Knowledge', 'Regulated', 'IAM'],
    fitTags: ['Document AI PM', 'Legal AI', 'Identity PM'],
  },
  {
    flagshipSlug: 'obsess',
    title: 'Obsess — 3D Commerce',
    description: '3D/immersive virtual-store platform (avatars, analytics, SOC2) shipped for Alo, Moncler, and Ralph Lauren.',
    stat: '3D commerce for Alo, Moncler, Ralph Lauren',
    relevanceTags: ['3D', 'Commerce', 'Consumer', 'Brand', 'Analytics'],
    fitTags: ['Consumer PM', 'Commerce', '3D/Immersive'],
  },
  {
    flagshipSlug: 'lupi',
    title: 'lupi.live — R3F Molecule Viewer',
    description: 'Interactive TypeScript / React Three Fiber / WebGL molecule viewer for inspecting molecular structures and trajectories in the browser.',
    stat: 'R3F/WebGL molecule viewer live in the browser',
    relevanceTags: ['ML', 'WebGL', 'Physics', 'Performance'],
    fitTags: ['Applied AI', 'High-Performance', 'Creative Engineering'],
  },
  {
    flagshipSlug: 'arkadium',
    title: 'Arkadium — NLP Content',
    description: 'NLP-driven AI content partnerships with major publishers; cut go-to-market time 25%.',
    stat: 'NLP AI content partnerships, -25% GTM time',
    relevanceTags: ['NLP', 'Adtech', 'Publishing', 'Partnerships'],
    fitTags: ['Adtech PM', 'Media', 'Partnerships'],
  },
];

function signalFor(role: TargetRole, topTarget?: TopTarget): string {
  return `${role.roleTitle} ${role.fitToAlex} ${role.positioningAngle} ${topTarget?.leadAngle || ''} ${role.aiFocus || ''}`.toLowerCase();
}

/** Pick up to `limit` proof points whose relevance matches the role signal. */
export function selectProofPoints(role: TargetRole, topTarget?: TopTarget, limit = 3): ProofPointMapping[] {
  const signal = signalFor(role, topTarget);
  const scored = PROOF_LIBRARY
    .map((p) => ({ p, score: p.relevanceTags.filter((t) => signal.includes(t.toLowerCase())).length }))
    .sort((a, b) => b.score - a.score);
  const picked = scored.filter((s) => s.score > 0).map((s) => s.p);
  // always keep lupine.science present as the AI-builder anchor if nothing else matched
  if (picked.length === 0) picked.push(PROOF_LIBRARY[0]);
  // top up to limit from remaining, preserving order
  for (const { p } of scored) {
    if (picked.length >= limit) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, limit);
}

/** Build 3 fit points: matched proof titles + their evidence; fall back to fitToAlex sentences. */
function buildFitPoints(role: TargetRole, proofs: ProofPointMapping[]): Array<{ point: string; evidence: string }> {
  const sentences = (role.fitToAlex || '')
    .split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return [0, 1, 2].map((i) => ({
    point: proofs[i]?.stat || sentences[i] || role.fitToAlex || 'Relevant experience',
    evidence: proofs[i]?.description || sentences[i] || role.fitToAlex,
  }));
}

function parseRequirements(requirementsText: string): string[] {
  return splitStructuredItems(requirementsText, 5);
}

/* ── GENERATOR: role + company -> composition variables ────────────── */
export function generateCompositionVariables(
  role: TargetRole,
  company: CompanyProfile,
  topTarget?: TopTarget,
): PitchCompositionVariables {
  const proofs = selectProofPoints(role, topTarget, 3);
  const fitPoints = buildFitPoints(role, proofs);
  const requirements = parseRequirements(role.keyRequirements);

  return {
    companyName: company.name,
    companyWordmark: company.logoUrl,
    companyAccent: company.accentColor || '#FF3366',

    roleTitle: role.roleTitle,
    location: role.location,
    compBenchmark: role.compBenchmark,

    fitPoint1: fitPoints[0].point,
    fitPoint1Evidence: fitPoints[0].evidence,
    fitPoint2: fitPoints[1].point,
    fitPoint2Evidence: fitPoints[1].evidence,
    fitPoint3: fitPoints[2].point,
    fitPoint3Evidence: fitPoints[2].evidence,

    requirement1: requirements[0] || 'AI / ML product expertise',
    requirement1Status: 'checked',
    requirement2: requirements[1] || 'Production / enterprise experience',
    requirement2Status: 'checked',
    requirement3: requirements[2] || 'Cross-functional leadership',
    requirement3Status: 'highlight',

    proofPoints: proofs.map((p) => ({ title: p.title, description: p.description, stat: p.stat })),

    ctaText: topTarget?.leadAngle || role.positioningAngle,
    ctaButtonText: "Let's talk",
    ctaUrl: role.jobUrl || '#',

    alexAccent: '#FF3366',
    videoId: slugify(`${company.name}-${role.roleTitle}`),
    renderDate: new Date().toISOString(),
  };
}

/* ── MANIFEST ──────────────────────────────────────────────────────── */
export interface CompositionManifest {
  compositions: Array<{ variables: PitchCompositionVariables; outputPath: string }>;
}

export function generateCompositionManifest(
  targetRoles: TargetRole[],
  companies: Map<string, CompanyProfile>,
  topTargets?: TopTarget[],
): CompositionManifest {
  const compositions: CompositionManifest['compositions'] = [];
  for (const role of targetRoles) {
    const company = companies.get(role.company);
    if (!company) continue;
    const topTarget = topTargets?.find((t) => t.company === role.company && t.roleTitle === role.roleTitle);
    const variables = generateCompositionVariables(role, company, topTarget);
    compositions.push({ variables, outputPath: `output/videos/${variables.videoId}.mp4` });
  }
  return { compositions };
}
