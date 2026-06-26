/* ------------------------------------------------------------------ */
/*  Flagship builds — the single source of truth for "what I built".   */
/*  Used by both Home (Selected Work) and Projects.                    */
/*  Drop a screenshot at /public/flagship/<slug>.png and set `image`   */
/*  to light up the card visual; cards look good text-only without it. */
/* ------------------------------------------------------------------ */

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Flagship {
  slug: string;
  name: string;
  tag: string;
  status: string;
  description: string;
  stack: string[];
  links: ProjectLink[];
  accent: string;
  /** Optional poster/screenshot at /public/flagship/<slug>.png (also used as video poster) */
  image?: string;
  /** Optional looping clip (mp4 H.264) at /public/flagship/<slug>.mp4 */
  video?: string;
  /** Optional webm source (preferred when present) */
  videoWebm?: string;
  /** Render the AW-style molecule glyph next to molecule/research work */
  molecule?: boolean;
}

export const flagships: Flagship[] = [
  {
    slug: 'lupi',
    name: 'lupi.live',
    tag: 'R3F MOLECULE VIEWER · PRODUCT SURFACE',
    status: 'LIVE',
    description:
      'The interactive molecule viewer: a TypeScript / React Three Fiber / WebGL surface for inspecting molecular structures and trajectories in the browser. This is the product interface — the thing people can touch.',
    stack: ['TypeScript', 'React Three Fiber', 'WebGL', 'Molecular Visualization', 'Browser Product'],
    links: [
      { label: 'lupi.live', url: 'https://lupi.live' },
      { label: 'GitHub', url: 'https://github.com/alexwelcing/lupine' },
    ],
    accent: '#33CCFF',
    molecule: true,
  },
  {
    slug: 'lupine-science',
    name: 'lupine.science',
    tag: 'MATERIALS-SCIENCE AI · COMPANY / RESEARCH',
    status: 'RESEARCH SITE',
    description:
      'The mathematical and scientific layer behind Lupine Science: MLIP benchmarks, phase-change trajectory simulation, and the research argument for applying machine-learned potentials to materials discovery.',
    stack: ['MLIP', 'Phase-Change Simulation', 'Python', 'Scientific Computing', 'Research Narrative'],
    links: [
      { label: 'lupine.science', url: 'https://lupine.science' },
      { label: 'GitHub', url: 'https://github.com/alexwelcing/lupine' },
    ],
    accent: '#6C63FF',
    molecule: true,
  },
  {
    slug: 'alexwelcing',
    name: 'alexwelcing.com',
    tag: '3D WEB · SEMANTIC SEARCH',
    status: 'LIVE',
    description:
      'An explorable 3D content site with real-time physics and AI semantic search over the writing — OpenAI embeddings served from pgvector in Supabase.',
    stack: ['Next.js', 'React Three Fiber', 'Cannon', 'Supabase pgvector'],
    links: [
      { label: 'alexwelcing.com', url: 'https://alexwelcing.com' },
      { label: 'GitHub', url: 'https://github.com/alexwelcing/NextDocsSearch' },
    ],
    accent: '#41B883',
  },
  {
    slug: 'high-era',
    name: 'High Era',
    tag: 'MARKETING-AUTOMATION OS',
    status: 'PRODUCTION · GCP',
    description:
      'A full go-to-market automation operating system — content generation, a workflow engine, and analytics — architected and shipped end-to-end as a single operator on Google Cloud.',
    stack: ['FastAPI', 'SvelteKit', 'Python', 'GCP / Cloud Run'],
    links: [],
    accent: '#3178C6',
  },
  {
    slug: 'lbr-workspace',
    name: 'AI API Execution Workspace',
    tag: 'ENTERPRISE AI PLATFORM · LBR',
    status: 'SHIPPED AT SCALE',
    description:
      'A type-safe workspace for executing AI APIs with live introspection and self-improving usage accuracy across three internal APIs — built on identity infrastructure I re-architected for billions of monthly requests.',
    stack: ['TypeScript', 'oRPC', 'SSO / OIDC', 'Enterprise'],
    links: [],
    accent: '#A78BFA',
  },
];
