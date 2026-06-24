import { useEffect, useRef, useState } from 'react';
import { layoutWordmark, CARDO_ASCENT, WORDMARK_FONT, type WMLayout } from '../lib/pretext';

interface Props {
  /** Max rendered width in px; the wordmark scales to fit its container up to this. */
  maxWidth?: number;
  color?: string;
  accent?: string;
  /** Slant in degrees (negative = up to the right). */
  slant?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Pretext-laid-out "Alex Welcing" wordmark — glyphs packed by their real advances,
 * tapering large→small, on a gentle slant. Mirrors the résumé PDF header.
 * Falls back to plain styled text until the Cardo webfont + Pretext are ready.
 */
export default function Wordmark({
  maxWidth = 760,
  color = '#FFFFFF',
  accent = '#1d3fd4',
  slant = -3.5,
  className,
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [base, setBase] = useState<WMLayout | null>(null);
  const [cw, setCw] = useState(0);

  // Measure once, after the Cardo webfont is available.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await document.fonts.load(`700 62px "Cardo"`);
        await document.fonts.ready;
      } catch { /* measure anyway */ }
      if (cancelled) return;
      try { setBase(layoutWordmark()); } catch { /* keep fallback */ }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Track container width for responsive scaling.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setCw(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const target = Math.min(maxWidth, cw || maxWidth);
  const f = base && base.width ? target / base.width : 0;
  const H = base ? base.height * f : 0;

  return (
    <div ref={wrapRef} className={className} style={{ width: '100%', ...style }}>
      {base && f > 0 ? (
        <div
          role="img"
          aria-label="Alex Welcing"
          style={{
            position: 'relative',
            width: base.width * f,
            height: H,
            transform: `rotate(${slant}deg)`,
            transformOrigin: '0% 100%',
          }}
        >
          {base.glyphs.map((g, i) => (
            <span
              key={`${g.ch}-${i}`}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: g.x * f,
                top: CARDO_ASCENT * (H - g.size * f),
                fontFamily: WORDMARK_FONT,
                fontWeight: 700,
                fontSize: g.size * f,
                lineHeight: 1,
                color: g.part === 'alex' ? color : accent,
                whiteSpace: 'pre',
              }}
            >
              {g.ch}
            </span>
          ))}
        </div>
      ) : (
        // Fallback before measurement: plain tapered-ish styled name.
        <span
          aria-label="Alex Welcing"
          style={{
            fontFamily: WORDMARK_FONT,
            fontWeight: 700,
            fontSize: target / 7,
            lineHeight: 1,
            display: 'inline-block',
            transform: `rotate(${slant}deg)`,
            transformOrigin: '0% 100%',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color }}>Alex</span>
          <span style={{ color: accent, fontSize: '0.62em' }}> Welcing</span>
        </span>
      )}
    </div>
  );
}
