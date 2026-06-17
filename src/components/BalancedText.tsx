import { useLayoutEffect, useRef, useState, type ElementType, type CSSProperties, type ReactNode } from 'react';
import { balancedWidth, fontFromElement } from '../lib/pretext';

interface Props {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Parse a CSS length (number=px, '24rem', '300px') to px; '%' / undefined → Infinity. */
function lengthToPx(v: CSSProperties['maxWidth']): number {
  if (v == null) return Infinity;
  if (typeof v === 'number') return v;
  const m = /^([\d.]+)(rem|px|em)?$/.exec(v.trim());
  if (!m) return Infinity;
  const n = parseFloat(m[1]);
  return m[2] === 'rem' || m[2] === 'em' ? n * 16 : n;
}

/**
 * Wraps text and uses Pretext to set the precise max-width at which it breaks
 * into its most even ragged lines — a measured `text-wrap: balance` that works
 * the same across browsers. Degrades to native `text-wrap: balance` until ready.
 */
export default function BalancedText({ as, className, style, children }: Props) {
  const Tag = (as ?? 'span') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const cap = useRef(lengthToPx(style?.maxWidth)); // original cap, before we override it
  const [maxWidth, setMaxWidth] = useState<number>();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const run = () => {
      if (cancelled || !el) return;
      const parent = el.parentElement;
      const parentW = parent ? parent.clientWidth : el.clientWidth;
      const avail = Math.min(parentW, cap.current);
      const text = (el.textContent || '').trim();
      if (!text || !isFinite(avail) || avail <= 0) return;
      try {
        const { font, letterSpacing } = fontFromElement(el);
        setMaxWidth(balancedWidth(text, font, avail, letterSpacing));
      } catch { /* leave native balance */ }
    };

    const start = async () => {
      try { await document.fonts.ready; } catch { /* measure anyway */ }
      run();
    };
    start();

    const parent = el.parentElement;
    const ro = new ResizeObserver(run);
    if (parent) ro.observe(parent);
    return () => { cancelled = true; ro.disconnect(); };
  }, [children]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ textWrap: 'balance', ...style, maxWidth: maxWidth ?? style?.maxWidth }}
    >
      {children}
    </Tag>
  );
}
