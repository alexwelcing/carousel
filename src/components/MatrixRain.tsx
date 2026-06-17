import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  opacity?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789><[]{}|/\\~^%$#@!*&';

export default function MatrixRain({ className = '', opacity = 1 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let isVisible = true;

    let columns: number[] = [];
    const fontSize = 20;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const numColumns = Math.ceil(width / fontSize);
      columns = new Array(numColumns).fill(0).map(() => Math.random() * -100);

      return { width, height };
    };

    let { width, height } = resize();

    const resizeObserver = new ResizeObserver(() => {
      const dims = resize();
      width = dims.width;
      height = dims.height;
    });
    resizeObserver.observe(container);

    let mouseX = -1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = Math.floor((e.clientX - rect.left) / fontSize);
    };

    const handleMouseLeave = () => {
      mouseX = -1;
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (!isVisible) return;

      // Semi-transparent black overlay for trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'Inconsolata', monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = columns[i] * fontSize;

        // Determine color based on mouse proximity
        if (i === mouseX && Math.random() > 0.5) {
          ctx.fillStyle = '#FFFFFF';
        } else if (Math.abs(i - mouseX) <= 2 && mouseX >= 0) {
          ctx.fillStyle = '#525252';
        } else {
          ctx.fillStyle = '#333333';
        }

        ctx.fillText(char, i * fontSize, y);

        // Reset drop
        if (y > height && Math.random() > 0.975) {
          columns[i] = 0;
        }

        columns[i]++;
      }
    };

    const intervalId = setInterval(draw, 33);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
