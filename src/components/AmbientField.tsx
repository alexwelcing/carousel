import { useEffect, useRef } from 'react';

interface AmbientFieldProps {
  className?: string;
  particleCount?: number;
  opacity?: number;
  color?: string;
  lineColor?: string;
  connectDistance?: number;
}

export default function AmbientField({
  className = '',
  particleCount = 80,
  opacity = 0.2,
  color = '#E6E7E8',
  lineColor = 'rgba(230, 231, 232, 0.06)',
  connectDistance = 140,
}: AmbientFieldProps) {
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
    let w = 0;
    let h = 0;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseR: number;
    }[] = [];

    const resize = () => {
      const rect = container!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          baseR: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      // Only re-init if dimensions changed significantly
      if (w === 0 || h === 0) init();
    });
    resizeObserver.observe(container);
    resize();
    init();

    // Mouse proximity interaction
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;
    let mouseTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseActive = false;
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Time-based pulsing
    let time = 0;

    const draw = () => {
      if (!isVisible) return;
      time += 0.008;

      ctx!.clearRect(0, 0, w, h);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Gentle pulsing radius
        p.r = p.baseR + Math.sin(time + p.x * 0.01) * 0.3;

        // Mouse repulsion
        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }

        // Velocity damping
        p.vx *= 0.999;
        p.vy *= 0.999;
      }

      // Draw connections
      ctx!.strokeStyle = lineColor;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDistance) {
            const alpha = 1 - dist / connectDistance;
            ctx!.globalAlpha = alpha * 0.4 * opacity;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      ctx!.fillStyle = color;
      for (const p of particles) {
        const pulse = 0.5 + Math.sin(time * 2 + p.x * 0.02) * 0.5;
        ctx!.globalAlpha = (0.3 + pulse * 0.7) * opacity;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
    };

    const loop = () => {
      animationId = requestAnimationFrame(loop);
      draw();
    };
    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      clearTimeout(mouseTimeout);
    };
  }, [particleCount, opacity, color, lineColor, connectDistance]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
