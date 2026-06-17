export interface Job {
  company: string;
  date: string;
  role: string;
  bullets: string[];
}

export const JOBS: Job[] = [
  {
    company: 'Law Business Research',
    date: 'Jan 2024 – Jun 2026',
    role: 'Technical Product Manager — Identity & Platform',
    bullets: [
      'Re-platformed the identity & subscription system handling billions of requests/mo, unifying access across 10+ products and unlocking new revenue.',
      'Shipped a type-safe AI API workspace (oRPC) with self-improving accuracy, and ran SSO / SAML / OIDC onboarding for 150+ AmLaw 200 firms.',
    ],
  },
  {
    company: 'Obsess VR',
    date: 'Apr 2022 – May 2023',
    role: 'Product Manager',
    bullets: [
      'Led the 3D experience platform — avatars, analytics, SOC2 — shipping for Alo, Moncler, and Ralph Lauren.',
      'Set the multi-year SaaS platform strategy for enterprise brand deployments.',
    ],
  },
  {
    company: 'Manatt, Phelps & Phillips',
    date: 'Aug 2017 – Apr 2022',
    role: 'Developer → Consultant',
    bullets: [
      'Took a legal-publishing SaaS from beta to millions in ARR with enterprise-grade data governance.',
      'Built AI-based document scanning and led IAM for a research platform serving 1,000+ clients.',
    ],
  },
  {
    company: 'Arkadium',
    date: 'Jul 2016 – Aug 2017',
    role: 'Partner Development',
    bullets: [
      'Pioneered NLP-driven AI content partnerships, cutting go-to-market time 25%.',
      'Drove cross-platform adoption with contextual, data-informed content systems.',
    ],
  },
];
