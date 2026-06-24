import { useEffect, useRef, useState, type MouseEvent } from 'react';

/**
 * Hosted Rive animation ("welcing-hero") served from Rive's CDN.
 * Built in the Rive editor: a calm editorial "quiet motion surface" — a
 * breathing cream orb inside slowly rotating concentric rings, an orbiting
 * accent dot, and two faint baseline rules. The artboard uses a responsive
 * Fill layout and a "Hero Loop" state machine that autoplays on load.
 *
 * The editorial motion is all driven by Rive's state machine. Cursor
 * interactivity is layered at the runtime: the panel parallax-tilts toward the
 * pointer in 3D and lifts (scale + deeper shadow) on hover, so the surface
 * reacts to the visitor. Honors prefers-reduced-motion (static frame, no tilt).
 */
const RIVE_EMBED_SRC =
  'https://rive.app/s/H9Ig1Cf8v02UqzLQd0lOYw/embed?runtime=rive-renderer';

const MAX_TILT_DEG = 7;
const SHADOW_REST = '0 18px 50px rgba(16,20,28,0.18)';
const SHADOW_HOVER = '0 30px 72px rgba(16,20,28,0.30)';

interface RivePanelProps {
  /** Override the hosted Rive embed URL. */
  src?: string;
  /** Accessible label for the motion surface. */
  title?: string;
  /** Deprecated: retained for backwards-compatibility, no longer rendered. */
  subtitle?: string;
  /** Deprecated: retained for backwards-compatibility, no longer rendered. */
  label?: string;
}

export default function RivePanel({
  src = RIVE_EMBED_SRC,
  title = 'A quiet motion surface',
}: RivePanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // The hero's GSAP reveal fades the [data-hero-panel] wrapper, but with this
  // dark panel inside, the tween can be left/re-applied at partial opacity —
  // which renders the near-black panel as grey over the light page. Lock the
  // wrapper to full opacity with !important so GSAP's (non-important) inline
  // writes can't pull it back down. Applied a couple of times to cover the
  // reveal window.
  useEffect(() => {
    const wrap = ref.current?.closest<HTMLElement>('[data-hero-panel]');
    if (!wrap) return;
    const lock = () => {
      wrap.style.setProperty('opacity', '1', 'important');
      wrap.style.setProperty('transform', 'none', 'important');
    };
    const t1 = window.setTimeout(lock, 1100);
    const t2 = window.setTimeout(lock, 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * MAX_TILT_DEG, ry: px * MAX_TILT_DEG });
  };

  const handleEnter = () => {
    if (!reducedMotion) setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const transform = reducedMotion
    ? undefined
    : `perspective(1100px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(
        2
      )}deg) scale(${hovered ? 1.03 : 1})`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)]"
      style={{
        minHeight: 420,
        backgroundColor: '#161310',
        transform,
        boxShadow: reducedMotion ? SHADOW_REST : hovered ? SHADOW_HOVER : SHADOW_REST,
        transition: hovered
          ? 'transform 0.12s ease-out, box-shadow 0.3s ease-out'
          : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
        willChange: 'transform',
      }}
    >
      {reducedMotion ? (
        // Static resting frame for visitors who prefer reduced motion.
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            style={{
              width: 168,
              height: 168,
              borderRadius: '9999px',
              backgroundColor: '#ECE5D5',
            }}
          />
          <span className="sr-only">{title}</span>
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          // pointerEvents:none lets the cursor drive the parallax tilt on the
          // wrapper instead of being captured by the embedded document.
          style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
          loading="lazy"
          allow="autoplay"
        />
      )}
    </div>
  );
}
