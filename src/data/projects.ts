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
      'Built the public product surface: a browser-based molecular trajectory viewer using TypeScript, React Three Fiber, and WebGL. Owns interaction model, frontend architecture, and live scientific demo.',
    stack: ['TypeScript', 'React Three Fiber', 'WebGL', 'Molecular Visualization', 'Browser Product'],
    links: [
      { label: 'lupi.live', url: 'https://lupi.live' },
      { label: 'GitHub', url: 'https://github.com/alexwelcing/lupine' },
    ],
    accent: '#0B5CAD',
    molecule: true,
  },
  {
    slug: 'lupine-science',
    name: 'lupine.science',
    tag: 'MATERIALS-SCIENCE AI · COMPANY / RESEARCH',
    status: 'RESEARCH SITE',
    description:
      'Built the research/company layer behind Lupine Science: MLIP benchmarks, phase-change trajectory simulation, and the technical narrative for applying machine-learned potentials to materials discovery.',
    stack: ['MLIP', 'Phase-Change Simulation', 'Python', 'Scientific Computing', 'Research Narrative'],
    links: [
      { label: 'lupine.science', url: 'https://lupine.science' },
      { label: 'GitHub', url: 'https://github.com/alexwelcing/lupine' },
    ],
    accent: '#4B3EC8',
    molecule: true,
  },
  {
    slug: 'alexwelcing',
    name: 'alexwelcing.com',
    tag: '3D WEB · SEMANTIC SEARCH',
    status: 'LIVE',
    description:
      'Built a 3D writing/product site with real-time physics and semantic search over the archive — OpenAI embeddings served from pgvector in Supabase.',
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
      'Architected and shipped a go-to-market automation OS end-to-end: content generation, workflow engine, analytics, and Google Cloud deployment as a single operator.',
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
