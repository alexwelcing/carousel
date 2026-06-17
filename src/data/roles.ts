/* ------------------------------------------------------------------ */
/*  Per-role tailored landing-page data                                */
/*  Each entry powers a page at /role/:slug — share one URL per app.   */
/* ------------------------------------------------------------------ */

export interface WhyFit {
  /** Short claim, e.g. "Identity at billions-scale" */
  point: string;
  /** Evidence that backs the claim, drawn from Alex's experience */
  detail: string;
}

export interface TailoredRole {
  slug: string;
  company: string;
  roleTitle: string;
  location: string;
  /** Direct application URL (or mailto:) */
  applyUrl: string;
  /** Accent hex for the page (defaults to brand red if omitted) */
  accent?: string;
  /** Short eyebrow label */
  tagline: string;
  /** Big hero line — the one-sentence pitch */
  headline: string;
  /** 1–2 sentence intro under the headline */
  intro: string;
  /** Mapped experience → why Alex fits this exact role */
  whyFit: WhyFit[];
  /** Punchy proof points / metrics */
  proof: string[];
}

export const roles: TailoredRole[] = [
  {
    slug: 'anthropic',
    company: 'Anthropic',
    roleTitle: 'Forward Deployed Engineer, Applied AI',
    location: 'New York City',
    applyUrl: 'https://job-boards.greenhouse.io/anthropic/jobs/4985877008',
    accent: '#D97757',
    tagline: '[ APPLIED AI · FORWARD DEPLOYED ]',
    headline: 'I ship multi-agent systems in production — and I want to ship them with Claude.',
    intro:
      'A forward-deployed engineer who embeds with enterprises, builds the agents, and feeds patterns back to product. I have done exactly this: replacing critical systems at billions-scale, and building my own multi-agent orchestration platform from scratch.',
    whyFit: [
      {
        point: 'I build production agents, not prototypes',
        detail:
          'CreateSuite is my own multi-agent orchestration system — autonomous agents with git-backed persistence, an inter-agent mailbox, and 6 model providers (Claude, OpenAI, Gemini, MiniMax, Copilot, Z.ai).',
      },
      {
        point: 'Enterprise deployment is my day job',
        detail:
          'At Law Business Research I ran white-glove SSO (SAML/OIDC) onboarding for 150+ AmLaw 200 firms — the exact customer-facing, high-trust deployment motion an FDE lives in.',
      },
      {
        point: 'I prototype in TypeScript and Python and ship',
        detail:
          'Hands-on architect PM: launched an AI API execution workspace with oRPC, type safety, and live introspection that improved model accuracy across 3 internal APIs.',
      },
    ],
    proof: [
      'Billions of monthly requests served by systems I rebuilt',
      '150+ enterprise SSO integrations delivered',
      'MCP servers, sub-agents & skills shipped in side projects',
    ],
  },
  {
    slug: 'runlayer',
    company: 'Runlayer',
    roleTitle: 'Forward Deployed Engineer / MoTS, Identity',
    location: 'Remote (US)',
    applyUrl: 'https://jobs.ashbyhq.com/runlayer/17c5964a-c58a-44b7-ae0c-e6f96cae7ffd',
    accent: '#33CCFF',
    tagline: '[ AGENT IDENTITY · MCP GATEWAY ]',
    headline: 'I built enterprise IAM for 150+ firms. Securing MCP for agents is the same problem, one layer up.',
    intro:
      'A secure MCP gateway that integrates with Okta and Entra, enforces credential boundaries, and governs what agents can touch. That is my background — SSO, OIDC, fine-grained access — applied to the agent era.',
    whyFit: [
      {
        point: 'Identity is my deepest domain',
        detail:
          'I replaced a legacy identity & subscription system servicing billions of monthly requests across 10+ products, and configured SAML/OIDC SSO for 150+ enterprises.',
      },
      {
        point: 'I already think in agents + tool calls',
        detail:
          'CreateSuite coordinates autonomous agents with an inter-agent mailbox and persistence — I understand the access and audit surface agents create.',
      },
      {
        point: 'Forward-deployed credibility',
        detail:
          'Direct enterprise relationships with security-conscious legal teams; I translate between security requirements and shipped product.',
      },
    ],
    proof: [
      'SAML / OIDC / SSO for 150+ AmLaw 200 firms',
      'Unified access model across 10+ products',
      'Multi-agent orchestration built end-to-end',
    ],
  },
  {
    slug: 'harvey',
    company: 'Harvey',
    roleTitle: 'Founding Forward Deployed Engineer',
    location: 'New York City',
    applyUrl: 'https://jobs.ashbyhq.com/harvey/24f97125-c406-4ae3-9f94-07dd1310e511',
    accent: '#33CCFF',
    tagline: '[ LEGAL AI · FORWARD DEPLOYED ]',
    headline: 'Legal document AI is where I started — now I want to take agentic legal AI from prototype to production.',
    intro:
      'Five years inside a top law firm building document AI and IAM for legal research, plus a career rebuilding enterprise legal platforms. I speak both lawyer and engineer.',
    whyFit: [
      {
        point: 'I have shipped legal document AI',
        detail:
          'At Manatt I devised AI-based document scanning for legal publication — automated image selection, sharpened knowledge-graph precision, eliminated manual error.',
      },
      {
        point: 'I know the AmLaw customer intimately',
        detail:
          'Onboarded 150+ AmLaw 200 firms onto enterprise SSO at LBR — I know how legal enterprises buy, deploy, and trust software.',
      },
      {
        point: 'Prototype-to-production is my pattern',
        detail:
          'Took a client publishing SaaS from beta to millions in ARR; rebuilt client apps cutting configuration time 60%.',
      },
    ],
    proof: [
      'Legal document AI shipped at a top-50 firm',
      'IAM for a research platform serving top-1000 clients',
      '150+ AmLaw 200 enterprise relationships',
    ],
  },
  {
    slug: 'glean',
    company: 'Glean',
    roleTitle: 'Founding Forward Deployed Engineer',
    location: 'Remote (US)',
    applyUrl: 'https://job-boards.greenhouse.io/gleanwork/jobs/4651991005',
    accent: '#41B883',
    tagline: '[ WORK AI · 0→1 FORWARD DEPLOYED ]',
    headline: 'Founder-level ownership, enterprise resources: I build 0→1 inside the customer and ship it to everyone.',
    intro:
      'A founding FDE discovers unsolved problems at strategic accounts and builds new product surfaces. I have done 0→1 inside enterprises and built full platforms solo.',
    whyFit: [
      {
        point: '0→1 builder with enterprise reps',
        detail:
          'Rebuilt client settings & analytics apps from scratch at LBR, and built High Era — a full marketing-automation OS (FastAPI + SvelteKit + GCP) end-to-end.',
      },
      {
        point: 'Enterprise integration is muscle memory',
        detail:
          'SSO/connector-style integration across 10+ products and 150+ firms — exactly the connector + access surface Glean lives in.',
      },
      {
        point: 'I close trust with executives and engineers',
        detail:
          'White-glove onboarding with enterprise legal leadership; I tailor depth to the room.',
      },
    ],
    proof: [
      'Full marketing-automation OS built solo on GCP',
      'Billions of requests, 10+ products unified',
      '348 public repos · Arctic Code Vault contributor',
    ],
  },
  {
    slug: 'sierra',
    company: 'Sierra',
    roleTitle: 'Product Manager, Agent Development',
    location: 'New York City',
    applyUrl: 'https://jobs.ashbyhq.com/Sierra/effd7cd2-8a28-4bae-a3b8-40720ba09717',
    accent: '#FF3366',
    tagline: '[ AGENT PLATFORM · PRODUCT ]',
    headline: 'An architect PM who builds the agents alongside the engineers and the customer.',
    intro:
      'Product manager who ships code. I have set agent-platform strategy at Obsess and built my own multi-agent system — I can own agent development end-to-end.',
    whyFit: [
      {
        point: 'Agent platform product experience',
        detail:
          'Led 3D platform features (avatars, explorable spaces, auth) for Alo, Moncler, Ralph Lauren at Obsess, and set long-term SaaS + SOC2 strategy.',
      },
      {
        point: 'I build what I spec',
        detail:
          'CreateSuite is a working multi-agent orchestration system I designed and built — convoy task grouping, mailbox, persistence, 6 providers.',
      },
      {
        point: 'Enterprise scale + reliability instinct',
        detail:
          'Rebuilt systems serving billions of requests; I sweat reliability, access, and the long tail of enterprise needs.',
      },
    ],
    proof: [
      'Agent/3D platform shipped for global enterprise brands',
      'Multi-agent orchestration built end-to-end',
      'SOC2 + usage-analytics pipeline owned',
    ],
  },
  {
    slug: 'hebbia',
    company: 'Hebbia',
    roleTitle: 'Product Manager, Document Intelligence',
    location: 'New York City',
    applyUrl: 'https://job-boards.greenhouse.io/hebbia/jobs/4297056005',
    accent: '#3178C6',
    tagline: '[ DOCUMENT AI · PRODUCT ]',
    headline: 'I built document AI for legal knowledge work. Hebbia is that thesis at finance-grade scale.',
    intro:
      'Document intelligence for finance and legal knowledge workers is exactly the problem I cut my teeth on — AI document processing, knowledge graphs, and access at scale.',
    whyFit: [
      {
        point: 'Document AI is in my history',
        detail:
          'Built AI-based document scanning and knowledge-graph precision at Manatt; took the publishing SaaS to millions in ARR.',
      },
      {
        point: 'Knowledge-worker products at scale',
        detail:
          'Led IAM and product for a research platform serving top-1000 clients with secure access to legal & regulatory analysis.',
      },
      {
        point: 'PM who prototypes the hard parts',
        detail:
          'NextDocsSearch is my own semantic-search platform — OpenAI embeddings + pgvector in Supabase, deployed at alexwelcing.com.',
      },
    ],
    proof: [
      'AI document scanning shipped for legal publishing',
      'Semantic search built with embeddings + pgvector',
      'Publishing SaaS taken to millions in ARR',
    ],
  },
  {
    slug: 'draftwise',
    company: 'DraftWise',
    roleTitle: 'Senior Front End Engineer',
    location: 'Remote (US)',
    applyUrl: 'https://app.dover.com/apply/DraftWise/601f18a4-d780-4266-a486-e07ea7906e69',
    accent: '#33CCFF',
    tagline: '[ LEGAL AI · FRONTEND ]',
    headline: 'React/TypeScript on a contract-AI product, by someone who actually knows the legal domain.',
    intro:
      'A senior frontend engineer who has shipped legal software for years and lives in React, TypeScript, and modern frontend architecture.',
    whyFit: [
      {
        point: 'Frontend is my craft',
        detail:
          'TypeScript, React, Next.js, React Three Fiber, Tailwind — alexwelcing.com is a 3D content platform I built (Next.js 16 + R3F + Cannon physics + pgvector).',
      },
      {
        point: 'Legal domain fluency',
        detail:
          'Five years at Manatt building legal publishing and document AI; I understand the contract / drafting workflow DraftWise serves.',
      },
      {
        point: 'I rebuild client apps that scale',
        detail:
          'Rebuilt client settings & analytics applications from scratch at LBR, cutting configuration time 60%.',
      },
    ],
    proof: [
      '3D + semantic-search web app shipped (Next.js/R3F)',
      '5 years building legal software',
      '348 public repos · 12 years shipping',
    ],
  },
  {
    slug: 'keycard',
    company: 'Keycard',
    roleTitle: 'Founding Product Manager (proactive)',
    location: 'Remote (Americas)',
    applyUrl: 'https://www.keycard.ai/careers',
    accent: '#41B883',
    tagline: '[ AGENT IDENTITY · FOUNDING ]',
    headline: 'I built IAM for 150+ enterprises. Now I want to build IAM for AI agents — as your first PM.',
    intro:
      'Identity for agents is a 1:1 match with my career. I am reaching out proactively: this is the role I have been preparing for without knowing it.',
    whyFit: [
      {
        point: 'Identity is my single deepest expertise',
        detail:
          'Replaced a legacy identity & subscription system at billions-scale; configured SAML/OIDC SSO for 150+ AmLaw 200 firms.',
      },
      {
        point: 'I understand agents at a build level',
        detail:
          'CreateSuite — my own multi-agent orchestration platform — means I understand the access, credential, and audit surface agents introduce.',
      },
      {
        point: 'First-PM range: strategy + hands-on',
        detail:
          'Architect PM who sets strategy and prototypes in TypeScript; comfortable owning product 0→1 with founders.',
      },
    ],
    proof: [
      'IAM for 150+ enterprises',
      'Unified access across 10+ products at billions-scale',
      'Multi-agent system built solo',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  TEMPLATE — copy into the `roles` array above to add a new target.  */
/*  See ROLE_PLAYBOOK.md for guidance. Keep whyFit to exactly 3 items. */
/* ------------------------------------------------------------------ */
// {
//   slug: 'company-slug',
//   company: 'Company',
//   roleTitle: 'Exact Posting Title',
//   location: 'NYC / Remote',
//   applyUrl: 'https://...',
//   accent: '#33CCFF',
//   tagline: '[ TRACK · FOCUS ]',
//   headline: 'One-sentence pitch in Alex’s voice that names their problem.',
//   intro: '1–2 sentences; becomes the tailored résumé summary.',
//   whyFit: [
//     { point: 'Short claim', detail: 'Concrete proof from Alex’s experience.' },
//     { point: 'Short claim', detail: 'Concrete proof from Alex’s experience.' },
//     { point: 'Short claim', detail: 'Concrete proof from Alex’s experience.' },
//   ],
//   proof: ['Metric one', 'Metric two', 'Metric three'],
// },

export function getRole(slug: string | undefined): TailoredRole | undefined {
  if (!slug) return undefined;
  return roles.find((r) => r.slug === slug);
}
