/**
 * Pretext-driven "measure then fit" for the résumé PDF.
 *
 * Pretext is a browser text-layout engine (Canvas measureText + Intl.Segmenter).
 * We run it in Node at build time by shimming OffscreenCanvas with @napi-rs/canvas
 * and registering the SAME TTFs @react-pdf renders with, so measurements line up.
 *
 * computeScale() measures the real content height of a résumé variant and returns
 * a global scale factor so the body fills the Legal page instead of being padded
 * with empty space.
 */
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import * as pt from '@chenglou/pretext';
import { writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JOBS } from '../src/data/experience';
import type { TailoredRole } from '../src/data/roles';

const FONTS: Record<string, string> = {
  Cardo: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/cardo/Cardo-Bold.ttf',
  Mono: 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Regular.ttf',
};

let ready = false;
async function setup() {
  if (ready) return;
  for (const [family, url] of Object.entries(FONTS)) {
    const p = join(tmpdir(), `${family}-fit.ttf`);
    if (!existsSync(p)) {
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(p, buf);
    }
    GlobalFonts.registerFromPath(p, family);
  }
  // Pretext's getMeasureContext() prefers OffscreenCanvas → shim it with napi canvas.
  (globalThis as unknown as { OffscreenCanvas: unknown }).OffscreenCanvas = class {
    private c: ReturnType<typeof createCanvas>;
    constructor(w: number, h: number) { this.c = createCanvas(w || 1, h || 1); }
    getContext(kind: string) { return this.c.getContext(kind as '2d'); }
  };
  ready = true;
}

const h = (text: string, font: string, width: number, lineHeight: number) =>
  pt.layout(pt.prepare(text, font), width, lineHeight).height;

const charWidth = (ch: string, sizePx: number) =>
  pt.measureNaturalWidth(pt.prepareWithSegments(ch, `${sizePx}px Cardo`));

export interface Glyph { ch: string; x: number; size: number; part: 'alex' | 'welcing' }
export interface Wordmark { glyphs: Glyph[]; width: number; height: number }

/**
 * Pretext-measured per-glyph layout for the "Alex Welcing" wordmark:
 * letters taper from large→small left→right, packed by their real advances
 * so kerning stays tight. The slant is applied by the renderer (container rotate).
 */
export async function computeWordmark(): Promise<Wordmark> {
  await setup();
  // Two tiers: "Alex" large, "Welcing" clearly smaller — each gently tapering
  // down-and-to-the-right. Glyphs are packed by their real Pretext advances.
  const WORDS: { text: string; part: 'alex' | 'welcing'; from: number; to: number }[] = [
    { text: 'Alex', part: 'alex', from: 62, to: 53 },
    { text: 'Welcing', part: 'welcing', from: 41, to: 30 },
  ];
  let x = 0;
  let maxSize = 0;
  const glyphs: Glyph[] = [];
  for (let w = 0; w < WORDS.length; w++) {
    const { text, part, from, to } = WORDS[w];
    const n = text.length;
    if (w > 0) x += charWidth(' ', from) * 0.42; // tight inter-word gap, scaled to the smaller tier
    for (let i = 0; i < n; i++) {
      const size = n === 1 ? from : from + (to - from) * (i / (n - 1));
      glyphs.push({ ch: text[i], x, size, part });
      x += charWidth(text[i], size) - size * 0.03; // slight negative tracking
      maxSize = Math.max(maxSize, size);
    }
  }
  return { glyphs, width: Math.ceil(x), height: Math.ceil(maxSize) };
}

// Fixed rail content (same across every variant)
const PROJECT_DESCS = [
  'Materials-science computing & million-atom molecular visualization, live in the browser.',
  'Autonomous multi-agent orchestration across six model providers, with persistence and an inter-agent mailbox — built end to end.',
  '3D content site with real-time physics and AI semantic search (Next.js, React Three Fiber, pgvector).',
];
const SKILL_ITEMS = [
  'Multi-agent orchestration · LLM integration · evals · RAG / pgvector · prompt engineering · model ops',
  'TypeScript · React · Next.js · React Three Fiber (3D) · Svelte · Tailwind · modern CSS',
  'Python · Go · Node · FastAPI · Postgres / Supabase · GCP / Cloud Run · API design',
  'SSO · SAML · OIDC · IAM · SOC2 · enterprise integration at billions-scale',
];

/** Returns a content scale (≈1.0–1.28) so the body fills the Legal page. */
export async function computeScale(role?: TailoredRole): Promise<number> {
  await setup();
  const MAIN_W = 290, RAIL_W = 208;
  const BF = '8.5px Mono', BLH = 8.5 * 1.5;
  const sectionLabel = 13.5 + 8; // sectionText + marginBottom

  // Main column (Experience [+ Why]) at scale 1
  let main = sectionLabel;
  for (const j of JOBS) {
    main += 13.5 * 1.25;          // company line box
    main += 8.5 * 1.25 + 3;       // role line + marginBottom
    for (const b of j.bullets) main += h(b, BF, MAIN_W, BLH) + 2.5;
    main += 13;                   // job marginBottom
  }
  if (role) {
    main += sectionLabel + 16;    // Why label + group marginBottom
    for (const w of role.whyFit) main += h(`† ${w.point}. ${w.detail}`, BF, MAIN_W, BLH) + 6;
  }

  // Rail column at scale 1 (fixed content)
  let rail = sectionLabel;
  for (const d of PROJECT_DESCS) rail += 9 + 10 + h(d, '8px Mono', RAIL_W, 8 * 1.45) + 2 + 11;
  rail += 16 + sectionLabel;
  for (const s of SKILL_ITEMS) rail += 8.5 + h(s, '8px Mono', RAIL_W, 8 * 1.45) + 6;
  rail += 16 + sectionLabel + 12.5 + 8;

  // Header height (wordmark + role + tagline + contact + rules); tagline varies
  const taglineText = role
    ? role.intro
    : 'Engineer turned product manager, relapsing back into engineering with AI — strategy and shipped code from one person, across 15 years of AI and enterprise platforms.';
  const taglineH = h(taglineText, '12.5px Cardo', 470, 12.5 * 1.4);
  const header = 95 + 13 + (role ? 14 : 0) + 7 + taglineH + 16 + 30;

  const availableBody = 1008 - 9 - 30 - 42 - header;
  const limiter = Math.max(main, rail);
  const scale = availableBody / limiter;
  return Math.max(1.0, Math.min(1.28, Number(scale.toFixed(3))));
}
