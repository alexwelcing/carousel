import { useEffect, useRef } from 'react';

interface NeuralMeshProps {
  className?: string;
  opacity?: number;
}

export default function NeuralMesh({ className = '', opacity = 0.25 }: NeuralMeshProps) {
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

    const nodes: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      r: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    interface PulsePacket {
      from: number;
      to: number;
      progress: number;
      speed: number;
      alive: boolean;
    }
    let packets: PulsePacket[] = [];

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
      nodes.length = 0;
      packets = [];

      // Create nodes in a loose grid with jitter
      const cols = 7;
      const rows = 4;
      const cellW = w / cols;
      const cellH = h / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jitterX = (Math.random() - 0.5) * cellW * 0.6;
          const jitterY = (Math.random() - 0.5) * cellH * 0.6;
          const x = cellW * c + cellW * 0.5 + jitterX;
          const y = cellH * r + cellH * 0.5 + jitterY;

          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 2 + 2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
          });
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();
    init();

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let time = 0;
    let lastPacketSpawn = 0;

    const getConnectedNodes = (idx: number): number[] => {
      const connected: number[] = [];
      const node = nodes[idx];
      for (let i = 0; i < nodes.length; i++) {
        if (i === idx) continue;
        const dx = node.x - nodes[i].x;
        const dy = node.y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < Math.max(w, h) * 0.35) {
          connected.push(i);
        }
      }
      return connected;
    };

    const draw = () => {
      if (!isVisible) return;
      time += 1;

      ctx!.clearRect(0, 0, w, h);

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        // Gentle drift back to base
        n.vx += (n.baseX - n.x) * 0.001;
        n.vy += (n.baseY - n.y) * 0.001;
        n.vx *= 0.99;
        n.vy *= 0.99;
      }

      // Spawn pulse packets
      if (time - lastPacketSpawn > 30 + Math.random() * 60) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const connected = getConnectedNodes(fromIdx);
        if (connected.length > 0) {
          const toIdx = connected[Math.floor(Math.random() * connected.length)];
          packets.push({
            from: fromIdx,
            to: toIdx,
            progress: 0,
            speed: 0.008 + Math.random() * 0.012,
            alive: true,
          });
        }
        lastPacketSpawn = time;
      }

      // Update packets
      for (const p of packets) {
        p.progress += p.speed;
        if (p.progress >= 1) {
          // Spawn continuation at destination
          if (Math.random() > 0.5) {
            const connected = getConnectedNodes(p.to);
            if (connected.length > 0) {
              const nextIdx = connected[Math.floor(Math.random() * connected.length)];
              packets.push({
                from: p.to,
                to: nextIdx,
                progress: 0,
                speed: p.speed,
                alive: true,
              });
            }
          }
          p.alive = false;
        }
      }
      packets = packets.filter((p) => p.alive);
      // Cap packets
      if (packets.length > 40) packets = packets.slice(-40);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const connected = getConnectedNodes(i);
        for (const j of connected) {
          if (j < i) continue; // Avoid double draw
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = Math.max(0, 1 - dist / (Math.max(w, h) * 0.35));

          ctx!.strokeStyle = `rgba(51, 204, 255, ${alpha * 0.15 * opacity})`;
          ctx!.lineWidth = 0.8;
          ctx!.beginPath();
          ctx!.moveTo(n1.x, n1.y);
          ctx!.lineTo(n2.x, n2.y);
          ctx!.stroke();
        }
      }

      // Draw pulse packets (traveling dots on connections)
      for (const p of packets) {
        const from = nodes[p.from];
        const to = nodes[p.to];
        const x = from.x + (to.x - from.x) * p.progress;
        const y = from.y + (to.y - from.y) * p.progress;

        const glow = Math.sin(p.progress * Math.PI);
        ctx!.fillStyle = `rgba(255, 51, 102, ${glow * opacity})`;
        ctx!.shadowColor = '#FF3366';
        ctx!.shadowBlur = 8 * glow;
        ctx!.beginPath();
        ctx!.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // Draw nodes
      for (const n of nodes) {
        const pulseR = n.r + Math.sin(n.pulse) * 1;
        const alpha = 0.4 + Math.sin(n.pulse * 0.5) * 0.2;

        // Outer glow
        ctx!.fillStyle = `rgba(51, 204, 255, ${alpha * 0.1 * opacity})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, pulseR * 3, 0, Math.PI * 2);
        ctx!.fill();

        // Core
        ctx!.fillStyle = `rgba(230, 231, 232, ${alpha * opacity})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx!.fill();
      }
    };

    const loop = () => {
      animationId = requestAnimationFrame(loop);
      draw();
    };
    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
    };
  }, [opacity]);

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
