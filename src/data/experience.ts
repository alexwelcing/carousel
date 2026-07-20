export interface Job {
  company: string;
  date: string;
  role: string;
  bullets: string[];
}

export const JOBS: Job[] = [
  {
    company: 'ALM',
    date: 'Jan 2024 – Jun 2026',
    role: 'Technical Product Manager — New York, NY',
    bullets: [
      'Led the 0-to-1 replacement of a legacy SQL-based entitlement system, improving reliability and unlocking new subscription revenue.',
      'Built and launched a monorepo AI API execution hub in TypeScript with secure, type-safe environments and live introspection.',
      'Ran the client identity & subscription platform for 50%+ of AmLaw 200 firms, streamlining SSO / SAML / OIDC configuration.',
    ],
  },
  {
    company: 'Obsess',
    date: 'May 2022 – May 2023',
    role: 'Product Manager — New York, NY',
    bullets: [
      'Shipped the 3D experience SaaS platform for enterprise brands using cloud-based orchestration and automation.',
      'Instrumented the product with the Google Analytics 4 API (e-commerce + heatmap) to drive data-informed roadmap decisions.',
      'Delivered real-time 3D rendering support across mobile, headset, and desktop devices.',
    ],
  },
  {
    company: 'Manatt, Phelps & Phillips',
    date: 'Aug 2017 – Apr 2022',
    role: 'Developer / Consultant — New York, NY',
    bullets: [
      'Took a client publishing SaaS from beta to millions in ARR, owning data reporting, security, and service monitoring.',
      'Built AI document scanning and image selection that cut consultant time and improved knowledge-graph accuracy.',
      'Developed and maintained a firm-wide knowledge and training portal delivering high ROI at low operating cost.',
    ],
  },
  {
    company: 'Arkadium',
    date: 'Jul 2016 – Jul 2017',
    role: 'Partner Development — New York, NY',
    bullets: [
      'Secured AI content partnerships with top digital publishers, owning the end-to-end business development process.',
      'Introduced an NLP-driven interactive advertising solution built on contextual understanding.',
    ],
  },
];

export interface Education {
  school: string;
  credential: string;
  date: string;
}

export const EDUCATION: Education[] = [
  {
    school: 'The University of Texas at Dallas — Naveen Jindal School of Management',
    credential: 'Bachelor of Science (B.S.), Marketing',
    date: '2010 – 2013',
  },
];

export const CERTIFICATIONS: string[] = [
  'Managing Platform Products',
  'Creating a Culture of Privacy',
];
