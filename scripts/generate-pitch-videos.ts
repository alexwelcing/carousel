#!/usr/bin/env node

/**
 * Render packet pitch videos with HyperFrames.
 *
 * Source of truth:
 *   pnpm run build emits /public/packets/<shareId>/pitch.html for every packet.
 *   This script extracts the embedded window.__ROLE_PITCH__ variables from those
 *   HTML files and renders MP4s to /public/packets/<shareId>/pitch.mp4.
 *
 * Usage:
 *   TSX_TSCONFIG_PATH=./tsconfig.app.json tsx scripts/generate-pitch-videos.ts --role generic-ai-product-platform
 *   TSX_TSCONFIG_PATH=./tsconfig.app.json tsx scripts/generate-pitch-videos.ts --top-targets --limit 30
 *   TSX_TSCONFIG_PATH=./tsconfig.app.json tsx scripts/generate-pitch-videos.ts --all --force
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

type PacketSource = 'curated-role' | 'top-target';

type Packet = {
  slug: string;
  shareId: string;
  sharePath: string;
  company: string;
  roleTitle: string;
  location: string;
  source: PacketSource;
  pitchHtml?: string;
  pitchVideoMp4?: string;
};

type Manifest = {
  count: number;
  packets: Packet[];
};

type PitchVariables = Record<string, string>;

type Options = {
  mode: 'top-targets' | 'strong-fit' | 'all';
  role?: string;
  limit?: number;
  force: boolean;
  docker: boolean;
  quality: 'draft' | 'standard' | 'high';
};

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const publicDir = resolve(root, 'public');
const manifestPath = resolve(publicDir, 'applications/manifest.json');

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = {
    mode: 'top-targets',
    force: false,
    docker: false,
    quality: 'standard',
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--top-targets') opts.mode = 'top-targets';
    else if (arg === '--strong-fit') opts.mode = 'strong-fit';
    else if (arg === '--all') opts.mode = 'all';
    else if (arg === '--role' && args[i + 1]) opts.role = args[++i];
    else if (arg === '--limit' && args[i + 1]) opts.limit = Number(args[++i]);
    else if (arg === '--force') opts.force = true;
    else if (arg === '--docker') opts.docker = true;
    else if (arg === '--quality' && args[i + 1]) opts.quality = args[++i] as Options['quality'];
  }

  return opts;
}

function loadManifest(): Manifest {
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing ${manifestPath}. Run pnpm run build first so packet pitch HTML exists.`);
  }
  return JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest;
}

function packetDir(packet: Packet): string {
  return resolve(publicDir, packet.sharePath.replace(/^\//, ''));
}

function extractPitchVariables(packet: Packet): PitchVariables {
  const htmlPath = resolve(packetDir(packet), 'pitch.html');
  if (!existsSync(htmlPath)) {
    throw new Error(`Missing pitch HTML for ${packet.slug}: ${htmlPath}. Run pnpm run build first.`);
  }
  const html = readFileSync(htmlPath, 'utf-8');
  const match = html.match(/window\.__ROLE_PITCH__=(.*?);<\/script>/s);
  if (!match) {
    throw new Error(`Could not find window.__ROLE_PITCH__ payload in ${htmlPath}`);
  }
  return JSON.parse(match[1]) as PitchVariables;
}

function selectPackets(manifest: Manifest, opts: Options): Packet[] {
  let packets = [...manifest.packets];

  if (opts.role) {
    packets = packets.filter((packet) => packet.slug === opts.role || packet.shareId === opts.role);
  } else if (opts.mode === 'top-targets') {
    packets = packets.filter((packet) => packet.source === 'top-target').slice(0, 30);
  } else if (opts.mode === 'strong-fit') {
    packets = packets.filter((packet) => packet.source === 'curated-role');
  }

  if (opts.limit && Number.isFinite(opts.limit) && opts.limit > 0) {
    packets = packets.slice(0, opts.limit);
  }

  return packets;
}

async function renderPacket(packet: Packet, opts: Options): Promise<'rendered' | 'skipped'> {
  const outDir = packetDir(packet);
  const outputPath = resolve(outDir, 'pitch.mp4');
  mkdirSync(outDir, { recursive: true });

  if (!opts.force && existsSync(outputPath)) {
    console.log(`[SKIP] ${packet.slug} already has ${outputPath}`);
    return 'skipped';
  }

  const variables = extractPitchVariables(packet);
  const args = [
    '--yes',
    'hyperframes@0.7.3',
    'render',
    'hyperframes-studio',
    '--composition',
    '.',
    '--output',
    outputPath,
    '--variables',
    JSON.stringify(variables),
    '--quality',
    opts.quality,
    '--fps',
    '30',
    '--low-memory-mode',
    '--workers',
    '1',
    '--protocol-timeout',
    '600000',
    '--player-ready-timeout',
    '120000',
  ];

  if (opts.docker) args.push('--docker');

  console.log(`[RENDER] ${packet.slug} → ${outputPath}`);
  await new Promise<void>((resolvePromise, reject) => {
    const proc = spawn('npx', args, { cwd: root, stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Render failed for ${packet.slug} with exit code ${code}`));
    });
    proc.on('error', reject);
  });

  return 'rendered';
}

async function main() {
  const opts = parseArgs();
  const manifest = loadManifest();
  const packets = selectPackets(manifest, opts);

  console.log('🎬 HyperFrames packet video renderer');
  console.log(`Mode=${opts.role ? `role:${opts.role}` : opts.mode} Count=${packets.length} Quality=${opts.quality} Force=${opts.force} Docker=${opts.docker}`);

  if (packets.length === 0) {
    throw new Error('No packets matched selection.');
  }

  let rendered = 0;
  let skipped = 0;
  for (const packet of packets) {
    const result = await renderPacket(packet, opts);
    if (result === 'rendered') rendered += 1;
    else skipped += 1;
    console.log(`[PROGRESS] rendered=${rendered} skipped=${skipped} total=${packets.length}`);
  }

  console.log(`✅ Done. rendered=${rendered} skipped=${skipped}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
