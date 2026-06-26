import { getAnonymousPacketBasePath } from '@/lib/shareLinks';

export interface ApplicationPacketOverride {
  summary: string;
  coverLetterLead?: string;
  recruiterNote?: string;
}

export const applicationPacketOverrides: Record<string, ApplicationPacketOverride> = {
  'tekshapers-marketing-expert-genai': {
    summary: 'A two-page, marketing-first packet tailored for C2C GenAI model-training work: lifecycle strategy, structured workflow mapping, evaluation rigor, and hands-on campaign execution history.',
    coverLetterLead: 'I bring a rare combination for this role: deep hands-on marketing execution across the full funnel and practical experience translating messy real-world workflows into systems and data structures AI teams can use.',
    recruiterNote: 'Best used when the hiring team needs a marketing SME who can collaborate fluently with ML, product, and engineering partners.',
  },
  anthropic: {
    summary: 'A founder-grade forward-deployed packet built around agent systems, enterprise deployments, and direct product feedback loops.',
    coverLetterLead: 'I already work the way Anthropic needs a forward-deployed engineer to work: I embed with users, build the system, and feed the learning back into product.',
    recruiterNote: 'Best used when the conversation should start on product instinct plus hands-on agent execution.',
  },
  runlayer: {
    summary: 'An identity-first packet that frames agent security and MCP governance as a direct continuation of prior enterprise IAM work.',
    coverLetterLead: 'I have already spent years solving the enterprise identity and trust problems that agent infrastructure is now inheriting.',
    recruiterNote: 'Strongest when leading with SSO, OIDC, access boundaries, and trust in agent workflows.',
  },
  harvey: {
    summary: 'A legal-AI packet that pairs document intelligence, AmLaw familiarity, and prototype-to-production range in a single narrative.',
    coverLetterLead: 'My legal AI background is not adjacent to Harvey; it is the foundation of why I can help ship agentic legal workflows that teams will trust.',
    recruiterNote: 'Use this when the reader cares about legal workflow credibility as much as raw AI enthusiasm.',
  },
  sierra: {
    summary: 'A product packet for agent-platform work that emphasizes architect-level product judgment backed by shipped code.',
    coverLetterLead: 'I am most effective in roles where product strategy, agent behavior, and implementation details all need to stay in one person’s head at once.',
    recruiterNote: 'Best for founder-minded product teams that want an operator who can spec and prototype in the same motion.',
  },
  keycard: {
    summary: 'A proactive founding-PM packet built around identity depth, agent-system intuition, and zero-to-one range.',
    coverLetterLead: 'Identity for agents is the clearest through-line in my career, and it is rare to find a PM who can pair that domain depth with hands-on agent-building experience.',
    recruiterNote: 'Strongest when sent as a direct proactive outreach packet rather than a formal application attachment.',
  },
};

export interface ApplicationPacketLinks {
  resumePdf: string;
  resumePrintPdf: string;
  coverLetterTxt: string;
  coverLetterPdf?: string;
  pitchHtml: string;
  pitchVideoMp4?: string;
}

export function getApplicationPacketLinks(slug: string): ApplicationPacketLinks {
  const basePath = getAnonymousPacketBasePath(slug);
  return {
    resumePdf: `${basePath}/resume.pdf`,
    resumePrintPdf: `${basePath}/resume-light.pdf`,
    coverLetterTxt: `${basePath}/cover-letter.txt`,
    pitchHtml: `${basePath}/pitch.html`,
    ...(slug === 'tekshapers-marketing-expert-genai' ? { coverLetterPdf: `${basePath}/cover-letter.pdf` } : {}),
  };
}
