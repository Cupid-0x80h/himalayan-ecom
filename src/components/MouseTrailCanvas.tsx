import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export const MouseTrailCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    const particleLimit = isMobile ? 30 : 80;

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Throttle pointer events for performance
    let lastSpawnTime = 0;
    const spawnThrottle = isMobile ? 100 : 50; // ms

    const spawnParticle = (x: number, y: number) => {
      const now = Date.now();
      if (now - lastSpawnTime < spawnThrottle) return;
      lastSpawnTime = now;

      if (particlesRef.current.length < particleLimit) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 60,
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      spawnParticle(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Animation loop
    const loop = (timestamp: number) => {
      if (!ctx || !canvas) return;

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Clear canvas with slight fade for trail effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      ctx.fillStyle = "hsl(188, 94%, 45%)";
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        const alpha = Math.max(0, p.life / 60);
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, (p.life / 60) * 4), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-20"
      style={{ mixBlendMode: "multiply" }}
    />
  );
};
