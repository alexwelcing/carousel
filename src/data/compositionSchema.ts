/**
 * Talent Prospecting Data Model
 * 
 * Defines the shape of:
 * - Target Roles (what we're applying for)
 * - Company Profiles (who we're pitching to)
 * - Top Targets (ranked shortlist)
 * - Composition Variables (what gets injected into HyperFrames videos)
 */

/* ─────────────────────────────────────────────────────────────────── */
/* TARGET ROLE: The specific job we're pitching for */
/* ─────────────────────────────────────────────────────────────────── */

export interface TargetRole {
  fit: 'A - Strong fit' | 'B - Possible fit' | 'C - Lower fit';
  company: string;
  roleTitle: string;
  location: string;
  type: 'On-site' | 'Hybrid' | 'Remote';
  compLinkedin?: string;
  compBenchmark: string; // e.g. "~$160K-$210K base; total comp ~$220K-$320K"
  jdSummary: string; // The reconstructed or actual job description
  keyRequirements: string; // Comma-separated or bullet list
  fitToAlex: string; // Why does Alex fit? (1–2 sentences)
  positioningAngle: string; // How to lead the pitch (1–2 sentences)
  stage?: string;
  funding?: string;
  aiFocus?: string;
  note?: string;
  jobUrl?: string;
}

/* ─────────────────────────────────────────────────────────────────── */
/* COMPANY PROFILE: The company we're pitching to */
/* ─────────────────────────────────────────────────────────────────── */

export interface CompanyProfile {
  name: string;
  stage: string; // e.g. "Series A", "public (NASDAQ: XYZ)"
  fundingBacking: string;
  hq: string; // Headquarters location
  size: string; // e.g. "~5,000 employees"
  whatTheyDo: string; // Mission/product description
  aiFocus: string; // How they use AI
  recent: string; // 2025–2026 developments
  website: string;
  roleCount?: number; // # of open roles at this company
  accentColor?: string; // Primary brand color (hex) for video personalization
  logoUrl?: string; // For video header
}

/* ─────────────────────────────────────────────────────────────────── */
/* TOP TARGET: Ranked role + company combo (A-tier shortlist) */
/* ─────────────────────────────────────────────────────────────────── */

export interface TopTarget {
  rank: number;
  score: number; // 1–10 fit score
  company: string;
  roleTitle: string;
  type: 'On-site' | 'Hybrid' | 'Remote';
  compBenchmark: string;
  whyItFitsAlex: string;
  leadAngle: string; // Lead with this positioning angle
  jobUrl?: string;
}

/* ─────────────────────────────────────────────────────────────────── */
/* COMPOSITION VARIABLES: What HyperFrames injects into the video */
/* ─────────────────────────────────────────────────────────────────── */

export interface PitchCompositionVariables {
  /* Header / Intro section */
  companyName: string;
  companyWordmark?: string; // URL to logo
  companyAccent: string; // Hex color (e.g. #FF3366)
  
  /* Role & Context section */
  roleTitle: string;
  location: string;
  compBenchmark: string; // "$XXK base; $XXK total"
  
  /* Why It Fits section */
  fitPoint1: string; // e.g. "I build production agents, not prototypes"
  fitPoint1Evidence: string;
  fitPoint2: string;
  fitPoint2Evidence: string;
  fitPoint3: string;
  fitPoint3Evidence: string;
  
  /* Key Requirements section */
  requirement1: string;
  requirement1Status: 'checked' | 'highlight'; // Visual state
  requirement2: string;
  requirement2Status: 'checked' | 'highlight';
  requirement3: string;
  requirement3Status: 'checked' | 'highlight';
  
  /* Proof Points section */
  proofPoints: Array<{
    title: string; // e.g. "Lupi.Live"
    description: string;
    stat: string; // e.g. "Materials-science ML at scale"
    imageUrl?: string;
    accentColor?: string;
  }>;
  
  /* Call-to-Action section */
  ctaText: string; // e.g. "Let's talk about building AI-powered platforms"
  ctaButtonText: string; // e.g. "Let's chat"
  ctaUrl: string; // Apply link or calendar
  
  /* Brand / Footer */
  alexAccent: string; // Alex's brand color (#FF3366 default)
  
  /* Metadata */
  videoId: string; // Unique slug for tracking
  renderDate: string; // ISO date
}

/* ─────────────────────────────────────────────────────────────────── */
/* PROOF POINT MAPPING: Connect flagship projects to roles */
/* ─────────────────────────────────────────────────────────────────── */

export interface ProofPointMapping {
  flagshipSlug: string; // e.g. 'lupi', 'createsuite'
  title: string;
  description: string;
  stat: string;
  relevanceTags: string[]; // e.g. ['ML Scale', 'WebGL', 'High-Performance']
  fitTags: string[]; // e.g. ['Forward Deployed Engineer', 'ML Interop']
}

/* ─────────────────────────────────────────────────────────────────── */
/* COMPOSITION GENERATOR: CSV row → HyperFrames variables */
/* ─────────────────────────────────────────────────────────────────── */

/**
 * Transform a TargetRole + CompanyProfile + TopTarget into HyperFrames composition variables.
 * This function orchestrates the data flow from CSV → video template.
 */
export function generateCompositionVariables(
  role: TargetRole,
  company: CompanyProfile,
  topTarget?: TopTarget,
): PitchCompositionVariables {
  // Extract fit points from the role's "Why It Fits" field
  // (In reality, this would be parsed from the CSV or enriched by an LLM)
  const fitPoints = parseFitPoints(role.fitToAlex);
  
  // Extract key requirements from the role
  const requirements = parseRequirements(role.keyRequirements);
  
  // Select proof points that match this role's fit tags
  const proofPoints = selectProofPoints(topTarget?.leadAngle || role.positioningAngle);
  
  return {
    companyName: company.name,
    companyWordmark: company.logoUrl,
    companyAccent: company.accentColor || '#FF3366',
    
    roleTitle: role.roleTitle,
    location: role.location,
    compBenchmark: role.compBenchmark,
    
    fitPoint1: fitPoints[0]?.point || 'Domain expertise',
    fitPoint1Evidence: fitPoints[0]?.evidence || role.fitToAlex,
    fitPoint2: fitPoints[1]?.point || 'Enterprise track record',
    fitPoint2Evidence: fitPoints[1]?.evidence || role.fitToAlex,
    fitPoint3: fitPoints[2]?.point || 'Hands-on builder',
    fitPoint3Evidence: fitPoints[2]?.evidence || role.fitToAlex,
    
    requirement1: requirements[0] || 'AI / ML expertise',
    requirement1Status: 'checked',
    requirement2: requirements[1] || 'Production experience',
    requirement2Status: 'checked',
    requirement3: requirements[2] || 'Team player',
    requirement3Status: 'highlight',
    
    proofPoints,
    
    ctaText: role.positioningAngle,
    ctaButtonText: 'Let\'s talk',
    ctaUrl: role.jobUrl || '#',
    
    alexAccent: '#FF3366',
    videoId: `${company.name.toLowerCase()}-${role.roleTitle.toLowerCase().replace(/\s+/g, '-')}`,
    renderDate: new Date().toISOString(),
  };
}

/* Helper functions */

function parseFitPoints(
  fitToAlex: string,
): Array<{ point: string; evidence: string }> {
  // In production, you'd parse or split this more intelligently
  // For now, return a structured array
  return [
    { point: 'Expert in your core problem', evidence: fitToAlex },
    { point: 'Proven at enterprise scale', evidence: fitToAlex },
    { point: 'Built similar systems before', evidence: fitToAlex },
  ];
}

function parseRequirements(requirementsText: string): string[] {
  // Split by comma or bullet
  return requirementsText.split(/[,\n-]/).map(r => r.trim()).filter(Boolean).slice(0, 5);
}

function selectProofPoints(_positioningAngle: string): ProofPointMapping[] {
  // In production, match proof points to the positioning angle
  // For now, return a fixed set
  const allProofs: ProofPointMapping[] = [
    {
      flagshipSlug: 'lupi',
      title: 'Lupi.Live',
      description: 'Materials-science computing and million-atom molecular visualization in the browser.',
      stat: 'Materials-science ML rendered in real time',
      relevanceTags: ['ML Scale', 'WebGL', 'Physics'],
      fitTags: ['Forward Deployed Engineer', 'ML Interop', 'High-Performance'],
    },
    {
      flagshipSlug: 'createsuite',
      title: 'CreateSuite',
      description: 'Autonomous multi-agent orchestration with persistence, mailbox routing, and provider abstraction.',
      stat: 'Multi-agent orchestration platform I built solo',
      relevanceTags: ['Agents', 'LLM Orchestration', 'Persistence'],
      fitTags: ['Product Manager', 'Agent Platform PM', 'Developer Tools'],
    },
    {
      flagshipSlug: 'alexwelcing',
      title: 'alexwelcing.com',
      description: '3D content platform with semantic search, realtime physics, and interactive storytelling.',
      stat: 'AI semantic search + 3D web',
      relevanceTags: ['Semantic Search', 'Embeddings', '3D Web'],
      fitTags: ['Full-Stack', 'AI Integration', 'Creative Engineering'],
    },
  ];
  
  return allProofs.slice(0, 3);
}

/* ─────────────────────────────────────────────────────────────────── */
/* EXPORT: Batch CSV data for HyperFrames composition */
/* ─────────────────────────────────────────────────────────────────── */

/**
 * Generate a manifest of all compositions to render.
 * Input: Parsed CSV data
 * Output: Array of { variables, outputPath }
 */
export interface CompositionManifest {
  compositions: Array<{
    variables: PitchCompositionVariables;
    outputPath: string; // e.g. "output/videos/adobe-ai-pm.mp4"
  }>;
}

export function generateCompositionManifest(
  targetRoles: TargetRole[],
  companies: Map<string, CompanyProfile>,
  topTargets?: TopTarget[],
): CompositionManifest {
  const compositions: CompositionManifest['compositions'] = [];
  
  // For each role, pair it with its company profile
  for (const role of targetRoles) {
    const company = companies.get(role.company);
    if (!company) continue;
    
    const topTarget = topTargets?.find(
      t => t.company === role.company && t.roleTitle === role.roleTitle
    );
    
    const variables = generateCompositionVariables(role, company, topTarget);
    
    compositions.push({
      variables,
      outputPath: `output/videos/${variables.videoId}.mp4`,
    });
  }
  
  return { compositions };
}
