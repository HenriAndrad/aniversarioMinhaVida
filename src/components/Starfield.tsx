import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "../store/contentStore";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  drift: number;
}

/**
 * Céu compartilhado — o fundo do site inteiro.
 * Canvas único, leve, com brilho que "respira".
 * A intensidade vem do tema (painel) e a luz global pode crescer
 * via a variável CSS --sky-light (usada na seção "Você consegue").
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { content } = useContent();
  const intensity = Math.min(1, Math.max(0, content.theme.particleIntensity));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 640;
      const count = Math.round((isMobile ? 60 : 130) * (0.4 + intensity * 0.9));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.2,
        drift: (Math.random() - 0.5) * 0.03,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const skyLight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--sky-light") || "0"
      );
      for (const s of stars) {
        const twinkle = reduced
          ? 1
          : 0.65 + 0.35 * Math.sin(t * 0.001 * s.speed + s.phase);
        const alpha = Math.min(1, s.baseAlpha * twinkle + skyLight * 0.35);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r + skyLight * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 213, 174, ${alpha})`;
        ctx.fill();
        if (!reduced) {
          s.x += s.drift;
          if (s.x < -2) s.x = width + 2;
          if (s.x > width + 2) s.x = -2;
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      build();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
