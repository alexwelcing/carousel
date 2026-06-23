#!/usr/bin/env node

/**
 * Talent Prospecting: CSV → HyperFrames Composition → Video
 * 
 * Usage:
 *   npx tsx scripts/generate-pitch-videos.ts [options]
 * 
 * Options:
 *   --top-targets    Render only Top 30 (A-tier shortlist) — fastest
 *   --strong-fit     Render all A-tier (119 roles) — ~1 hour
 *   --all            Render all 261 roles — ~2–3 hours (use Docker)
 *   --batch N        Parallel workers (default: auto) 
 *   --output DIR     Output directory (default: output/videos)
 *   --docker         Use Docker rendering instead of local
 */

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';
import { spawn } from 'child_process';

/* ──────────────────────────────────────────────────────────────── */
/* CSV PARSING */
/* ──────────────────────────────────────────────────────────────── */

function parseCsvFile(filePath: string): any[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

interface TargetRole {
  'Fit': string;
  'Company': string;
  'Role Title': string;
  'Location': string;
  'Type': string;
  'Comp (LinkedIn)': string;
  'Comp Benchmark': string;
  'JD Summary': string;
  'Key Requirements': string;
  'Fit to Alex': string;
  'Positioning Angle': string;
  'Stage'?: string;
  'Funding': string;
  'AI Focus': string;
  'Note'?: string;
  'Job URL'?: string;
}

interface CompanyProfile {
  'Company': string;
  'Stage': string;
  'Funding / Backing': string;
  'HQ': string;
  'Size': string;
  'What They Do': string;
  'AI Focus': string;
  'Recent (2025-26)': string;
  'Website': string;
  '# Roles'?: number;
}

interface TopTarget {
  'Rank': string;
  'Score': string;
  'Company': string;
  'Role Title': string;
  'Type': string;
  'Comp Benchmark': string;
  'Why It Fits Alex': string;
  'Lead Angle for Resume/Cover Letter': string;
  'Job URL'?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/* COMPOSITION GENERATION */
/* ──────────────────────────────────────────────────────────────── */

interface CompositionVariables {
  companyName: string;
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
  requirement2: string;
  requirement3: string;
  ctaText: string;
  videoId: string;
}

function generateCompositionVariables(
  role: TargetRole,
  company: CompanyProfile,
): CompositionVariables {
  const fitPoints = (role['Fit to Alex'] || '').split('·').map(s => s.trim()).filter(Boolean);
  
  return {
    companyName: company['Company'] || role['Company'],
    roleTitle: role['Role Title'] || 'Product Manager',
    location: role['Location'] || 'Remote',
    compBenchmark: role['Comp Benchmark'] || '~$150K–$250K',
    fitPoint1: fitPoints[0] || 'Deep domain expertise',
    fitPoint1Evidence: fitPoints[0] || role['Fit to Alex'],
    fitPoint2: fitPoints[1] || 'Enterprise-scale track record',
    fitPoint2Evidence: fitPoints[1] || role['Fit to Alex'],
    fitPoint3: fitPoints[2] || 'Hands-on builder mentality',
    fitPoint3Evidence: fitPoints[2] || role['Fit to Alex'],
    requirement1: (role['Key Requirements'] || '').split(/[,\n]/)[0]?.trim() || 'AI/ML expertise',
    requirement2: (role['Key Requirements'] || '').split(/[,\n]/)[1]?.trim() || 'Product experience',
    requirement3: (role['Key Requirements'] || '').split(/[,\n]/)[2]?.trim() || 'Team player',
    ctaText: role['Positioning Angle'] || 'Let\'s talk about shipping AI at enterprise scale.',
    videoId: `${role['Company'].toLowerCase().replace(/\s+/g, '-')}-${role['Role Title'].toLowerCase().replace(/\s+/g, '-')}`,
  };
}

/* ──────────────────────────────────────────────────────────────── */
/* HYPERFRAMES INVOCATION */
/* ──────────────────────────────────────────────────────────────── */

async function renderComposition(
  variables: CompositionVariables,
  outputPath: string,
  useDocker: boolean = false,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      'hyperframes',
      'render',
      'hyperframes-studio',
      '--composition',
      'talentpitch.html',
      '--output',
      outputPath,
      '--variables',
      JSON.stringify(variables),
      '--quality',
      'standard',
      '--fps',
      '30',
    ];
    
    if (useDocker) {
      args.push('--docker');
    } else {
      args.push('--low-memory-mode', '--workers', '1', '--protocol-timeout', '600000');
    }
    
    console.log(`[RENDER] ${variables.videoId}`);
    
    const proc = spawn('npx', args, { stdio: 'inherit' });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`Render failed for ${variables.videoId}`));
      }
    });
    
    proc.on('error', reject);
  });
}

/* ──────────────────────────────────────────────────────────────── */
/* MAIN ORCHESTRATION */
/* ──────────────────────────────────────────────────────────────── */

async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  let renderMode = 'top-targets'; // default: fastest
  let maxWorkers = 4;
  let useDocker = false;
  let outputDir = 'output/videos';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--top-targets') renderMode = 'top-targets';
    if (args[i] === '--strong-fit') renderMode = 'strong-fit';
    if (args[i] === '--all') renderMode = 'all';
    if (args[i] === '--batch' && i + 1 < args.length) maxWorkers = parseInt(args[i + 1]);
    if (args[i] === '--docker') useDocker = true;
    if (args[i] === '--output' && i + 1 < args.length) outputDir = args[i + 1];
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('\n🎬 Talent Prospecting: CSV → HyperFrames Video Generator');
  console.log(`Mode: ${renderMode} | Workers: ${maxWorkers} | Docker: ${useDocker}`);
  console.log('');
  
  // Load CSVs
  console.log('📂 Loading CSV data...');
  const targetRoles = parseCsvFile('LinkedIn_Promoted_Roles_RESEARCH - Target Roles.csv') as TargetRole[];
  const companyProfiles = parseCsvFile('LinkedIn_Promoted_Roles_RESEARCH - Company Profiles.csv') as CompanyProfile[];
  const topTargets = parseCsvFile('LinkedIn_Promoted_Roles_RESEARCH - Top Targets.csv') as TopTarget[];
  
  console.log(`✓ ${targetRoles.length} roles, ${companyProfiles.length} companies, ${topTargets.length} top targets`);
  console.log('');
  
  // Build company map
  const companyMap = new Map(companyProfiles.map(c => [c['Company'], c]));
  
  // Filter roles based on mode
  let rolesToRender = targetRoles;
  
  if (renderMode === 'top-targets') {
    const topCompanies = new Set(topTargets.map(t => t['Company']));
    const topRoleTitles = new Set(topTargets.map(t => t['Role Title']));
    rolesToRender = targetRoles.filter(
      r => topCompanies.has(r['Company']) && topRoleTitles.has(r['Role Title'])
    );
  } else if (renderMode === 'strong-fit') {
    rolesToRender = targetRoles.filter(r => r['Fit'].includes('A - Strong fit'));
  }
  // else: renderMode === 'all' → use all rolesToRender
  
  console.log(`🎯 Rendering ${rolesToRender.length} compositions...\n`);
  
  // Batch render
  let completed = 0;
  const queue = rolesToRender
    .slice(0, 10) // Start with first 10 for testing
    .map(role => ({
      role,
      company: companyMap.get(role['Company']),
      variables: generateCompositionVariables(role, companyMap.get(role['Company']) || {} as CompanyProfile),
    }))
    .filter(item => item.company); // Skip if company not found
  
  console.log(`Processing ${queue.length} compositions (showing first 10)\n`);
  
  // Render sequentially (to avoid resource contention in low-memory container)
  for (const item of queue) {
    const outputPath = path.join(outputDir, `${item.variables.videoId}.mp4`);
    
    try {
      await renderComposition(item.variables, outputPath, useDocker);
      completed++;
      console.log(`[${completed}/${queue.length}] ✓ ${item.variables.videoId}\n`);
    } catch (error) {
      console.error(`[ERROR] ${item.variables.videoId}:`, error);
    }
  }
  
  console.log('\n✅ Render batch complete!');
  console.log(`Generated: ${completed} videos`);
  console.log(`Output: ${path.resolve(outputDir)}`);
  console.log(`\nNext: Update tailored landing pages with video URLs.`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
