/**
 * Browser-side Pretext typography.
 *
 * Pretext (@chenglou/pretext) lays out text with Canvas measureText + Intl.Segmenter
 * — no DOM reflow. We use it for two things across the site:
 *   1. layoutWordmark(): the slanted, tapering "Alex Welcing" wordmark, packed
 *      glyph-by-glyph by each letter's real advance (matches the résumé PDF).
 *   2. balancedWidth(): the precise width at which a heading/paragraph wraps into
 *      its most even ragged lines (a measured `text-wrap: balance`).
 */
import * as pt from '@chenglou/pretext';

export const WORDMARK_FONT = '"Cardo", Georgia, serif';

export interface WMGlyph { ch: string; x: number; size: number; part: 'alex' | 'welcing' }
export interface WMLayout { glyphs: WMGlyph[]; width: number; height: number }

// Two tiers: "Alex" large, "Welcing" clearly smaller, each gently tapering.
const WORDS: { text: string; part: 'alex' | 'welcing'; from: number; to: number }[] = [
  { text: 'Alex', part: 'alex', from: 62, to: 53 },
  { text: 'Welcing', part: 'welcing', from: 41, to: 30 },
];

/** Baseline offset ratio for Cardo Bold — used to sit tapered glyphs on one line. */
export const CARDO_ASCENT = 0.72;

const widthOf = (ch: string, sizePx: number) =>
  pt.measureNaturalWidth(pt.prepareWithSegments(ch, `700 ${sizePx}px ${WORDMARK_FONT}`));

/** Per-glyph wordmark layout at base sizes. Scale linearly to any render width. */
export function layoutWordmark(): WMLayout {
  let x = 0;
  let maxSize = 0;
  const glyphs: WMGlyph[] = [];
  WORDS.forEach((w, wi) => {
    const n = w.text.length;
    if (wi > 0) x += widthOf(' ', w.from) * 0.42; // tight inter-word gap
    for (let i = 0; i < n; i++) {
      const size = n === 1 ? w.from : w.from + (w.to - w.from) * (i / (n - 1));
      glyphs.push({ ch: w.text[i], x, size, part: w.part });
      x += widthOf(w.text[i], size) - size * 0.03; // slight negative tracking
      maxSize = Math.max(maxSize, size);
    }
  });
  return { glyphs, width: Math.ceil(x), height: Math.ceil(maxSize) };
}

/**
 * Smallest width that keeps `text` on the same number of lines it uses at
 * `availWidth` — i.e. the width that balances the ragged right edge. Returns
 * `availWidth` when the text already fits on one line.
 */
export function balancedWidth(text: string, font: string, availWidth: number, letterSpacing = 0): number {
  if (!text || availWidth <= 0) return availWidth;
  const prep = pt.prepareWithSegments(text, font, { letterSpacing });
  const natural = pt.measureNaturalWidth(prep);
  // Pretext can under-measure slightly vs. the live webfont; pad so we never
  // clip a line that would otherwise fit. Pad scales with font size.
  const sizePx = parseFloat((/(\d+(?:\.\d+)?)px/.exec(font) || [])[1] || '16');
  const pad = Math.ceil(sizePx * 0.18) + 4;
  // Already fits one line at the available width → don't constrain it.
  if (natural + pad <= availWidth) return Math.ceil(availWidth);
  const target = pt.measureLineStats(prep, availWidth).lineCount;
  let lo = Math.max(1, Math.floor(natural / target));
  let hi = Math.ceil(availWidth);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pt.measureLineStats(prep, mid).lineCount <= target) hi = mid;
    else lo = mid + 1;
  }
  const balanced = Math.ceil(pt.measureLineStats(prep, lo).maxLineWidth) + pad;
  return Math.min(Math.ceil(availWidth), balanced);
}

/** Resolve a CSS font shorthand + letter-spacing from a live element. */
export function fontFromElement(el: Element): { font: string; letterSpacing: number } {
  const cs = getComputedStyle(el);
  const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const sizePx = parseFloat(cs.fontSize) || 16;
  const weight = cs.fontWeight || '400';
  const style = cs.fontStyle && cs.fontStyle !== 'normal' ? `${cs.fontStyle} ` : '';
  const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) || 0;
  return { font: `${style}${weight} ${sizePx}px ${family}`, letterSpacing: ls };
}
