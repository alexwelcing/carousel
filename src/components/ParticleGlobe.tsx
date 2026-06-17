import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleGlobeProps {
  className?: string;
}

export default function ParticleGlobe({ className }: ParticleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationId: number;
    let isVisible = true;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const dpr = Math.min(1.6, window.devicePixelRatio);
    renderer.setPixelRatio(dpr);

    // Particle count
    const PARTICLE_COUNT = 2500;
    const SPHERE_RADIUS = 30;

    // Create icosahedron to sample vertices from
    const icoGeo = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 12);
    const icoPositions = icoGeo.attributes.position;
    const vertexCount = icoPositions.count;

    // Sample random vertices for our particle positions
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const randomIndex = Math.floor(Math.random() * vertexCount);
      const x = icoPositions.getX(randomIndex);
      const y = icoPositions.getY(randomIndex);
      const z = icoPositions.getZ(randomIndex);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    icoGeo.dispose();

    // Create points
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xe6e7e8,
      size: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const rotation = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Scroll tracking
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let w = 0; // velocity width for deformation

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        rotation.targetY += dx * 0.005;
        rotation.targetX += dy * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta, 50);
      w = scrollVelocity * 2;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize handling
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Visibility handling
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Auto-rotation speed
    const AUTO_ROTATE_SPEED = 0.001;

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth rotation lerp
      rotation.x += (rotation.targetX - rotation.x) * 0.05;
      rotation.y += (rotation.targetY - rotation.y) * 0.05;

      // Auto-rotate when not dragging
      if (!isDragging) {
        rotation.targetY += AUTO_ROTATE_SPEED;
      }

      // Decay scroll velocity — fast relax so the sphere reforms immediately on scroll stop
      w *= 0.78;
      if (w < 0.3) w = 0;
      scrollVelocity *= 0.82;

      // Apply rotation
      points.rotation.x = rotation.x;
      points.rotation.y = rotation.y;

      // Camera follows mouse subtly
      camera.position.x += (mouse.x * 30 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 20 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Velocity deformation
      const speedFactor = w * 0.02;
      const posArray = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const ox = originalPositions[idx];
        const oy = originalPositions[idx + 1];
        const oz = originalPositions[idx + 2];

        if (speedFactor > 0.01) {
          const distFromCenter = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const angle = Math.atan2(oz, ox);
          const teardropAngle = angle + Math.sin(angle) * speedFactor * Math.PI;
          const ratio = (1 + speedFactor) / (distFromCenter || 1);
          const dist = distFromCenter;

          const newX = Math.cos(teardropAngle) * dist * ratio;
          const newZ = Math.sin(teardropAngle) * dist * ratio;
          const compression = Math.cos(angle) * speedFactor * 0.8;
          const newY = oy * (1 + compression);

          posArray[idx] += (newX - posArray[idx]) * 0.1;
          posArray[idx + 1] += (newY - posArray[idx + 1]) * 0.1;
          posArray[idx + 2] += (newZ - posArray[idx + 2]) * 0.1;
        } else {
          // Snap back to sphere — responsive, no lingering delay
          posArray[idx] += (ox - posArray[idx]) * 0.22;
          posArray[idx + 1] += (oy - posArray[idx + 1]) * 0.22;
          posArray[idx + 2] += (oz - posArray[idx + 2]) * 0.22;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Glow based on scroll velocity
      const glowIntensity = 0.5 + (scrollVelocity / 50) * 1.5;
      material.size = 0.4 * glowIntensity;

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
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
