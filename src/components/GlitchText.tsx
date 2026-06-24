import { useRef, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const dir = Math.random() > 0.5 ? 'alternate' : 'alternate-reverse';
    el.style.setProperty('--dir', dir);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`glitch-container ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Base text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layer 1 - magenta */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{
          color: 'var(--accent)',
          animation: 'none',
        }}
        data-text={text}
      >
        <span
          className="block"
          style={{
            animation: 'c1 0.3s linear infinite',
            animationDirection: 'var(--dir, alternate)' as const,
          }}
        >
          {text}
        </span>
      </span>

      {/* Glitch layer 2 - cyan */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{
          color: 'rgba(16, 21, 31, 0.45)',
          animation: 'none',
        }}
        data-text={text}
      >
        <span
          className="block"
          style={{
            animation: 'c2 0.3s linear infinite reverse',
            animationDirection: 'var(--dir, alternate-reverse)' as const,
          }}
        >
          {text}
        </span>
      </span>

      {/* Glitch layer 3 - green */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{
          color: 'rgba(16, 21, 31, 0.28)',
          animation: 'none',
        }}
        data-text={text}
      >
        <span
          className="block"
          style={{
            animation: 'c3 0.3s linear infinite',
            animationDirection: 'var(--dir, alternate)' as const,
          }}
        >
          {text}
        </span>
      </span>

      {/* Glitch layer 4 - amber */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{
          color: 'rgba(29, 63, 212, 0.5)',
          animation: 'none',
        }}
        data-text={text}
      >
        <span
          className="block"
          style={{
            animation: 'c4 0.3s linear infinite reverse',
            animationDirection: 'var(--dir, alternate-reverse)' as const,
          }}
        >
          {text}
        </span>
      </span>

      <style>{`
        .glitch-container:hover > span:not(:first-child) {
          opacity: 0.8 !important;
        }
      `}</style>
    </div>
  );
}
