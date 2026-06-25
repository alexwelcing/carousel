import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

type Packet = {
  slug: string;
  company: string;
  roleTitle: string;
  resumePdf: string;
  resumeLightPdf: string;
  coverLetterTxt: string;
  coverLetterPdf?: string;
};

type Manifest = {
  generatedAt: string;
  count: number;
  packets: Packet[];
};

const ROOT = resolve(process.cwd());
const MANIFEST_PATH = resolve(ROOT, 'public/applications/manifest.json');

const EXPECTED_PAGES_BY_SLUG: Record<string, number> = {
  'tekshapers-marketing-expert-genai': 2,
};

function toFsPath(publicPath: string): string {
  const cleaned = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath;
  return resolve(ROOT, 'public', cleaned.replace(/^public\//, ''));
}

function countPdfPages(buf: Buffer): number {
  return (buf.toString('latin1').match(/\/Type\s*\/Page(?![s])/g) || []).length;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const manifestRaw = await readFile(MANIFEST_PATH, 'utf-8');
  const manifest = JSON.parse(manifestRaw) as Manifest;

  const failures: string[] = [];
  const checks: string[] = [];

  if (manifest.count !== manifest.packets.length) {
    failures.push(`Manifest count mismatch: count=${manifest.count}, packets.length=${manifest.packets.length}`);
  }

  for (const packet of manifest.packets) {
    const expectedPages = EXPECTED_PAGES_BY_SLUG[packet.slug] ?? 1;
    const resumePath = toFsPath(packet.resumePdf);
    const resumeLightPath = toFsPath(packet.resumeLightPdf);
    const coverLetterTxtPath = toFsPath(packet.coverLetterTxt);
    const coverLetterPdfPath = packet.coverLetterPdf ? toFsPath(packet.coverLetterPdf) : '';

    for (const [label, path] of [
      ['resumePdf', resumePath],
      ['resumeLightPdf', resumeLightPath],
      ['coverLetterTxt', coverLetterTxtPath],
    ] as const) {
      if (!(await fileExists(path))) {
        failures.push(`[${packet.slug}] Missing ${label}: ${path}`);
      }
    }

    if (packet.coverLetterPdf && !(await fileExists(coverLetterPdfPath))) {
      failures.push(`[${packet.slug}] Missing coverLetterPdf: ${coverLetterPdfPath}`);
    }

    if (await fileExists(resumePath)) {
      const buf = await readFile(resumePath);
      const pageCount = countPdfPages(buf);
      if (pageCount !== expectedPages) {
        failures.push(`[${packet.slug}] resumePdf pages=${pageCount}, expected=${expectedPages}`);
      }
      if (buf.byteLength < 8000) {
        failures.push(`[${packet.slug}] resumePdf too small (${buf.byteLength} bytes)`);
      }
    }

    if (await fileExists(resumeLightPath)) {
      const buf = await readFile(resumeLightPath);
      const pageCount = countPdfPages(buf);
      if (pageCount !== expectedPages) {
        failures.push(`[${packet.slug}] resumeLightPdf pages=${pageCount}, expected=${expectedPages}`);
      }
      if (buf.byteLength < 8000) {
        failures.push(`[${packet.slug}] resumeLightPdf too small (${buf.byteLength} bytes)`);
      }
    }

    if (await fileExists(coverLetterTxtPath)) {
      const txt = await readFile(coverLetterTxtPath, 'utf-8');
      const required = ['Alex Welcing'];
      for (const token of required) {
        if (!txt.includes(token)) {
          failures.push(`[${packet.slug}] coverLetterTxt missing token: "${token}"`);
        }
      }
      if (txt.length < 300) {
        failures.push(`[${packet.slug}] coverLetterTxt too short (${txt.length} chars)`);
      }
    }

    checks.push(`[ok] ${packet.slug} (${packet.company} — ${packet.roleTitle})`);
  }

  if (failures.length > 0) {
    console.error('\nResume packet QA FAILED\n');
    for (const failure of failures) console.error(`- ${failure}`);
    console.error(`\nChecked ${manifest.packets.length} packets, failures=${failures.length}\n`);
    process.exit(1);
  }

  console.log('\nResume packet QA PASSED\n');
  console.log(`Checked ${manifest.packets.length} packets from ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error('\nResume packet QA crashed\n');
  console.error(error);
  process.exit(1);
});
