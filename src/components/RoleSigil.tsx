/**
 * RoleSigil — deterministic 1-of-1 generative art per role.
 *
 * Same slug -> same composition, forever. No stored assets.
 * Shape language is chosen by track, palette is derived from the role's
 * accent (company brand color) via hue rotation, so every role page,
 * OG card, and pitch backdrop shares one visual system.
 *
 *   agents     -> orbital paths + satellite nodes
 *   identity   -> concentric rings + radial keys (lattice of trust)
 *   enterprise -> isometric lattice grid
 *   builder    -> flow-field strands
 *
 * Default export renders an absolutely-positioned SVG layer intended to sit
 * behind hero content (pointer-events: none).
 */

export type SigilTrack = 'agents' | 'identity' | 'enterprise' | 'builder';

/* ---------- deterministic PRNG (mulberry32 over FNV-1a of slug) ---------- */
function hashSlug(slug: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- palette derivation from accent hex ---------- */
function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0x33ccff;
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0; const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
const hsl = (h: number, s: number, l: number, a = 1) =>
  `hsla(${((h % 360) + 360) % 360}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a})`;

export function derivePalette(accent: string) {
  const [h, s] = hexToHsl(accent);
  return {
    primary: hsl(h, Math.max(s, 0.55), 0.62),
    secondary: hsl(h + 32, Math.max(s * 0.9, 0.45), 0.55),
    tertiary: hsl(h - 28, Math.max(s * 0.8, 0.4), 0.48),
    faint: hsl(h, Math.max(s * 0.6, 0.3), 0.6, 0.16),
  };
}

/* ---------- per-track composers (pure string builders) ---------- */
type P = ReturnType<typeof derivePalette>;
const pt = (v: number) => Math.round(v * 100) / 100;

function orbits(r: () => number, p: P): string {
  const cx = 300 + r() * 120, cy = 170 + r() * 60;
  let out = '';
  const n = 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const rx = 70 + i * (34 + r() * 18), ry = rx * (0.42 + r() * 0.22);
    const rot = r() * 180;
    const col = [p.primary, p.secondary, p.tertiary][i % 3];
    out += `<ellipse cx="${pt(cx)}" cy="${pt(cy)}" rx="${pt(rx)}" ry="${pt(ry)}" fill="none" stroke="${col}" stroke-opacity="${0.5 - i * 0.06}" stroke-width="${pt(1.6 - i * 0.15)}" transform="rotate(${pt(rot)} ${pt(cx)} ${pt(cy)})"/>`;
    const t = r() * Math.PI * 2;
    const nx = cx + rx * Math.cos(t) * Math.cos(rot * Math.PI / 180) - ry * Math.sin(t) * Math.sin(rot * Math.PI / 180);
    const ny = cy + rx * Math.cos(t) * Math.sin(rot * Math.PI / 180) + ry * Math.sin(t) * Math.cos(rot * Math.PI / 180);
    out += `<circle cx="${pt(nx)}" cy="${pt(ny)}" r="${pt(3 + r() * 4)}" fill="${col}" fill-opacity="0.9"/>`;
  }
  out += `<circle cx="${pt(cx)}" cy="${pt(cy)}" r="${pt(8 + r() * 6)}" fill="${p.primary}"/>`;
  return out;
}

function rings(r: () => number, p: P): string {
  const cx = 330 + r() * 80, cy = 175 + r() * 40;
  let out = '';
  const n = 5 + Math.floor(r() * 3);
  for (let i = 1; i <= n; i++) {
    const rad = i * (22 + r() * 10);
    const dash = i % 2 ? `${pt(6 + r() * 20)} ${pt(4 + r() * 10)}` : 'none';
    const col = [p.primary, p.secondary, p.tertiary][i % 3];
    out += `<circle cx="${pt(cx)}" cy="${pt(cy)}" r="${pt(rad)}" fill="none" stroke="${col}" stroke-opacity="${0.55 - i * 0.055}" stroke-width="1.4"${dash === 'none' ? '' : ` stroke-dasharray="${dash}"`}/>`;
  }
  const keys = 6 + Math.floor(r() * 5);
  for (let k = 0; k < keys; k++) {
    const a = (k / keys) * Math.PI * 2 + r() * 0.3;
    const r1 = 20 + r() * 30, r2 = n * 26 + r() * 20;
    out += `<line x1="${pt(cx + r1 * Math.cos(a))}" y1="${pt(cy + r1 * Math.sin(a))}" x2="${pt(cx + r2 * Math.cos(a))}" y2="${pt(cy + r2 * Math.sin(a))}" stroke="${p.faint}" stroke-width="1"/>`;
    out += `<circle cx="${pt(cx + r2 * Math.cos(a))}" cy="${pt(cy + r2 * Math.sin(a))}" r="2.4" fill="${p.secondary}" fill-opacity="0.85"/>`;
  }
  return out;
}

function lattice(r: () => number, p: P): string {
  let out = '';
  const ox = 80 + r() * 60, oy = 60 + r() * 40, s = 34 + r() * 10;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 5; j++) {
      if (r() < 0.25) continue;
      const x = ox + i * s + j * s * 0.5, y = oy + j * s * 0.86;
      const col = [p.primary, p.secondary, p.tertiary][(i + j) % 3];
      const op = 0.14 + r() * 0.4;
      if (r() < 0.7) {
        out += `<path d="M${pt(x)} ${pt(y)} l${pt(s * 0.5)} ${pt(-s * 0.28)} l${pt(s * 0.5)} ${pt(s * 0.28)} l${pt(-s * 0.5)} ${pt(s * 0.28)} z" fill="none" stroke="${col}" stroke-opacity="${pt(op)}" stroke-width="1.3"/>`;
      } else {
        out += `<path d="M${pt(x)} ${pt(y)} l${pt(s * 0.5)} ${pt(-s * 0.28)} l${pt(s * 0.5)} ${pt(s * 0.28)} l${pt(-s * 0.5)} ${pt(s * 0.28)} z" fill="${col}" fill-opacity="${pt(op * 0.5)}"/>`;
      }
    }
  }
  return out;
}

function flow(r: () => number, p: P): string {
  let out = '';
  const strands = 10 + Math.floor(r() * 8);
  for (let i = 0; i < strands; i++) {
    const y0 = 40 + r() * 280;
    const amp = 20 + r() * 60, ph = r() * Math.PI * 2, freq = 0.004 + r() * 0.004;
    let d = `M -20 ${pt(y0)}`;
    for (let x = 0; x <= 720; x += 24) {
      d += ` L ${x} ${pt(y0 + Math.sin(x * freq * Math.PI * 2 + ph) * amp * Math.sin(x / 720 * Math.PI))}`;
    }
    const col = [p.primary, p.secondary, p.tertiary][i % 3];
    out += `<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${pt(0.1 + r() * 0.3)}" stroke-width="${pt(0.8 + r() * 1.4)}"/>`;
  }
  return out;
}

const COMPOSERS: Record<SigilTrack, (r: () => number, p: P) => string> = {
  agents: orbits, identity: rings, enterprise: lattice, builder: flow,
};

export function sigilSvgMarkup(slug: string, track: SigilTrack, accent: string): string {
  const r = mulberry32(hashSlug(slug));
  const p = derivePalette(accent);
  const body = (COMPOSERS[track] ?? orbits)(r, p);
  return `<svg viewBox="0 0 700 350" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
}

export default function RoleSigil({ slug, track, accent, opacity = 0.5 }: {
  slug: string; track?: string; accent: string; opacity?: number;
}) {
  const t = (['agents', 'identity', 'enterprise', 'builder'].includes(track ?? '')
    ? track : 'agents') as SigilTrack;
  const markup = sigilSvgMarkup(slug, t, accent);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0, opacity, pointerEvents: 'none',
        maskImage: 'linear-gradient(to left, black 20%, transparent 85%)',
        WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 85%)',
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
