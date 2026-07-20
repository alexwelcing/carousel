/**
 * Pipeline v2 composer: leads.json + profile.ts -> generated TailoredRole set.
 *
 * Replaces the legacy triage-engine output (truncated headlines, mailto URLs,
 * comp strings leaking into proof). Every field is composed from verified
 * profile facts and passes the same shape as hand-curated entries.
 *
 * Usage:  tsx scripts/compose-roles.ts        # writes src/data/v2/roles.generated.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PROOF_LIBRARY, type Track } from '../src/data/v2/profile';
import type { TailoredRole, WhyFit } from '../src/data/roles';

const here = dirname(fileURLToPath(import.meta.url));

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
}

const TRACK_NARRATIVE: Record<Track, {
  tagline: string;
  headline: string;
  intro: string;
  whyFit: WhyFit[];
}> = {
  identity: {
    tagline: '[ IDENTITY · ENTERPRISE TRUST ]',
    headline: 'I built enterprise identity for 150+ firms at billions-scale — access, trust, and deployment are my home turf.',
    intro: 'Identity is my deepest domain: I re-platformed identity and subscription infrastructure serving billions of monthly requests, ran SAML/OIDC SSO for 150+ AmLaw 200 firms, and carry that access-boundary discipline into every product I ship.',
    whyFit: [
      { point: 'Identity at billions-scale is my track record', detail: 'Replaced a legacy identity & subscription system across 10+ products at ALM, serving billions of monthly requests with SOC 2 and strict access boundaries.' },
      { point: 'Enterprise deployment with security-conscious buyers', detail: 'Configured SAML / OIDC SSO for 150+ AmLaw 200 firms — high-trust onboarding where security, legal, and product teams all had to align before value shipped.' },
      { point: 'I prototype and ship, not just spec', detail: 'Built a type-safe AI API execution workspace in TypeScript with live introspection, and my own multi-agent stack end-to-end — I understand the systems I govern.' },
    ],
  },
  agents: {
    tagline: '[ AI AGENTS · PRODUCT EXECUTION ]',
    headline: 'I ship production AI agents and the platforms they run on — from orchestration design to the deployed surface.',
    intro: 'I build AI products as working systems: multi-agent orchestration across multiple LLM providers, a type-safe AI API execution workspace with evals and live introspection, and enterprise deployments where reliability is non-negotiable.',
    whyFit: [
      { point: 'Production agents, not prototypes', detail: 'Built a multi-agent orchestration platform end-to-end across multiple LLM providers, with git-backed persistence and eval loops that improved accuracy across three internal APIs.' },
      { point: 'Platform judgment from billions-scale systems', detail: 'Re-platformed identity and subscription infrastructure at ALM serving billions of monthly requests — I know what production-grade means for AI surfaces.' },
      { point: 'Customer-facing technical credibility', detail: 'Enterprise SSO onboarding for 150+ firms and 3D-commerce deployments for Alo, Moncler, and Ralph Lauren — I embed with customers and feed patterns back to product.' },
    ],
  },
  enterprise: {
    tagline: '[ ENTERPRISE PLATFORM · DELIVERY ]',
    headline: 'I turn enterprise requirements into shipped platforms — with the trust, governance, and rollout discipline that scale demands.',
    intro: 'A decade of enterprise platform work: legal-publishing SaaS from beta to millions in ARR, 3D commerce for global brands, and identity infrastructure at billions of requests per month — always owning the path from requirement to production.',
    whyFit: [
      { point: 'Enterprise delivery is my default mode', detail: 'Took a legal-publishing SaaS from beta to millions in ARR at Manatt and shipped 3D-commerce platforms for Alo, Moncler, and Ralph Lauren at Obsess.' },
      { point: 'Governance and trust built in', detail: 'SOC 2, IAM, and data-boundary discipline from running identity for 50%+ of AmLaw 200 firms — regulated-industry requirements are familiar ground.' },
      { point: 'Technical depth to hold the whole system', detail: 'I prototype in TypeScript and Python, shipped an AI API workspace with live introspection, and built my own multi-agent stack — implementation detail never gets lost in translation.' },
    ],
  },
  builder: {
    tagline: '[ BUILDER · ZERO TO ONE ]',
    headline: 'I take products from nothing to shipped — strategy, system design, and the code, in one person.',
    intro: 'Architect PM who builds: lupi.live and lupine.science shipped solo as a materials-science AI stack, a marketing-automation OS deployed on GCP, and enterprise platforms rebuilt at billions-scale — 12+ years of end-to-end ownership.',
    whyFit: [
      { point: 'Zero-to-one range, repeatedly proven', detail: 'Shipped lupi.live (R3F/WebGL molecule viewer), lupine.science (MLIP research layer), and a GCP marketing-automation OS — each solo, from concept to production.' },
      { point: 'Enterprise-scale judgment when it matters', detail: 'Re-platformed identity infrastructure at ALM serving billions of monthly requests — startup pace with big-system discipline.' },
      { point: 'AI-native building style', detail: 'Multi-agent orchestration across LLM providers, evals, document AI, and semantic search — AI is my default toolkit, not an add-on.' },
    ],
  },
};

function slugify(company: string, roleTitle: string): string {
  return `${company}-${roleTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function composeRole(lead: Lead): TailoredRole {
  const n = TRACK_NARRATIVE[lead.track];
  return {
    slug: lead.slug || slugify(lead.company, lead.roleTitle),
    company: lead.company,
    roleTitle: lead.roleTitle,
    location: lead.location,
    applyUrl: lead.applyUrl,
    accent: lead.accent || '#33CCFF',
    tagline: n.tagline,
    headline: n.headline,
    intro: n.intro,
    whyFit: n.whyFit,
    proof: [...PROOF_LIBRARY[lead.track]],
  };
}

const raw = JSON.parse(readFileSync(resolve(here, '../src/data/v2/leads.json'), 'utf-8'));
const leads: Lead[] = raw.leads.filter((l: Lead) => l.status !== 'closed');
const generated = leads.map(composeRole);

const outPath = resolve(here, '../src/data/v2/roles.generated.json');
writeFileSync(outPath, JSON.stringify(generated, null, 2) + '\n', 'utf-8');
console.log(`[compose-roles] ${generated.length} roles -> src/data/v2/roles.generated.json`);
for (const r of generated) console.log(`  - ${r.slug}`);
