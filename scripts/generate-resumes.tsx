/**
 * Build-time résumé generation.
 * Renders one base résumé (public/resume.pdf) plus one tailored résumé per role
 * (public/resumes/<slug>.pdf) so downloads are static, instant, and CDN-cached —
 * no client-side PDF rendering or font fetching at runtime.
 *
 * Runs before `vite build` (see package.json "build" script), so the generated
 * files land in public/ and get copied into dist/.
 */
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import ResumePDFDocument, { type Wordmark } from '../src/components/ResumePDF';
import type { TailoredRole } from '../src/data/roles';
import { roles } from '../src/data/roles';
import { computeScale, computeWordmark } from './pretext-fit';

const wordmark: Wordmark = await computeWordmark();

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '../public');
const resumesDir = resolve(publicDir, 'resumes');

await mkdir(resumesDir, { recursive: true });

const pageCount = (buf: Buffer) =>
  (buf.toString('latin1').match(/\/Type\s*\/Page(?![s])/g) || []).length;

type Props = { role?: TailoredRole; theme?: 'dark' | 'light'; scale: number };
const render = (p: Props) => renderToBuffer(createElement(ResumePDFDocument, { ...p, wordmark }));

/**
 * Pretext gives the starting fill estimate; we then render-and-verify with the
 * real engine, stepping down until the page genuinely fits. Returns the dark
 * buffer at the winning scale + the scale itself.
 */
async function fitDark(role: TailoredRole | undefined) {
  let scale = await computeScale(role);
  let buf = await render({ role, scale });
  while (pageCount(buf) > 1 && scale > 0.9) {
    scale = Math.round((scale - 0.04) * 1000) / 1000;
    buf = await render({ role, scale });
  }
  return { scale, buf };
}

let count = 0;

async function emit(role: TailoredRole | undefined, darkPath: string, lightPath: string) {
  const { scale, buf } = await fitDark(role);
  const light = await render({ role, theme: 'light', scale });
  await writeFile(darkPath, buf);
  await writeFile(lightPath, light);
  count += 2;
  console.log(`[resumes] ${role ? role.slug : 'base'} → fit scale ${scale}`);
}

// Base
await emit(undefined, resolve(publicDir, 'resume.pdf'), resolve(publicDir, 'resume-light.pdf'));
// Per role
for (const role of roles) {
  await emit(role, resolve(resumesDir, `${role.slug}.pdf`), resolve(resumesDir, `${role.slug}-light.pdf`));
}

console.log(`[resumes] done — ${count} PDFs generated.`);
