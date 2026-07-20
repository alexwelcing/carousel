/**
 * Single source of truth for Alex's identity, experience, and proof.
 * Every rendering surface (résumés, cover letters, pitch pages, landing pages)
 * consumes this module — nothing else may hardcode identity facts.
 */

export const IDENTITY = {
  name: 'Alex Welcing',
  positioning: 'AI Product Builder · Technical PM · Enterprise Platform Operator',
  location: 'New York, NY',
  phone: '817-734-5375',
  email: 'alexwelcing@gmail.com',
  github: 'https://github.com/alexwelcing',
  linkedin: 'https://linkedin.com/in/alexwelcing',
  site: 'https://welc.ing',
} as const;

export const SUMMARY_BASE =
  'Architect PM and product-minded engineer who ships AI products from strategy through production code: production agents, materials-science ML, document AI, 3D interfaces, enterprise identity, and developer platforms.';

export { JOBS, EDUCATION, CERTIFICATIONS } from '../experience';
export { flagships } from '../projects';

/** Verified, reusable proof claims. Composer picks 3 by track relevance. */
export const PROOF_LIBRARY = {
  identity: [
    'Billions of monthly requests served by identity systems I re-platformed at ALM',
    '150+ enterprise SSO / SAML / OIDC deployments with security-conscious buyers',
    'Unified access model across 10+ products',
  ],
  agents: [
    'Multi-agent orchestration platform built end-to-end across multiple LLM providers',
    'Type-safe AI API execution workspace shipped at ALM with live introspection and evals',
    'MCP servers, sub-agents, and skills shipped as independent systems',
  ],
  enterprise: [
    'Enterprise 3D-commerce deployments for Alo, Moncler, and Ralph Lauren at Obsess',
    'Legal-publishing SaaS taken from beta to millions in ARR at Manatt',
    'AI document scanning and knowledge-graph extraction shipped for legal workflows',
  ],
  builder: [
    '12+ years shipping product, code, and judgment end-to-end',
    'lupi.live and lupine.science: materials-science AI stack shipped solo',
    '3D web, semantic search, and scientific computing in production',
  ],
} as const;

export type Track = keyof typeof PROOF_LIBRARY;
