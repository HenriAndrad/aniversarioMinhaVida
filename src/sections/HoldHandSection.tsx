import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";
import { applyTokens } from "../utils/text";

/**
 * Pressione e segure. Enquanto ela segura, a luz cresce e o site
 * responde ao toque — quando completa, a mensagem aparece.
 * A ideia é simples: mostrar que alguém fica.
 */
export default function HoldHandSection() {
  const { content } = useContent();
  const h = content.holdHand;
  const reduced = useReducedMotion();

  const total = Math.max(1, h.seconds) * 1000;
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number>();
  const startedAt = useRef(0);
  const base = useRef(0);

  useEffect(() => {
    if (!holding) {
      // solta devagar: o progresso não zera de imediato
      const tick = () => {
        setProgress((p) => {
          const next = Math.max(0, p - 0.012);
          if (next > 0 && !done) raf.current = requestAnimationFrame(tick);
          return next;
        });
      };
      if (!done && progress > 0) raf.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf.current!);
    }

    startedAt.current = performance.now();
    base.current = progress;
    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      const p = Math.min(1, base.current + elapsed / total);
      setProgress(p);
      if (p >= 1) {
        setDone(true);
        setHolding(false);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [holding, done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!h.enabled) return null;

  const label = done ? "" : holding ? h.holding : h.prompt;

  return (
    <Section id="mao">
      <SectionTitle>{h.title}</SectionTitle>

      <Reveal delay={0.15} className="mt-12">
        <button
          type="button"
          aria-label={h.prompt}
          className="relative grid h-56 w-56 select-none place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] sm:h-64 sm:w-64"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            if (!done) setHolding(true);
          }}
          onPointerUp={() => setHolding(false)}
          onPointerLeave={() => setHolding(false)}
          onPointerCancel={() => setHolding(false)}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !done) setHolding(true);
          }}
          onKeyUp={() => setHolding(false)}
          style={{ touchAction: "none" }}
        >
          {/* calor que cresce */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)",
            }}
            animate={{
              opacity: 0.25 + progress * 0.75,
              scale: reduced ? 1 : 0.9 + progress * 0.35,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* anel de progresso */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(240,234,224,0.12)" strokeWidth="1.5" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
              style={{ filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 60%, transparent))" }}
            />
          </svg>

          {/* batimento discreto enquanto segura */}
          <motion.span
            aria-hidden="true"
            className="absolute rounded-full border"
            style={{
              width: "58%",
              height: "58%",
              borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
            }}
            animate={
              holding && !reduced
                ? { scale: [1, 1.06, 1, 1.04, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1.15, repeat: holding && !reduced ? Infinity : 0, ease: "easeInOut" }}
          />

          <AnimatePresence mode="wait">
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 max-w-[70%] text-center font-display text-lg italic text-pergaminho"
              >
                {applyTokens(label, content.relationship)}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </Reveal>

      <div className="mt-10 min-h-[6rem] px-6">
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <p
                className={`mx-auto max-w-prose2 whitespace-pre-line font-display text-2xl italic leading-relaxed sm:text-3xl ${
                  isPlaceholder(h.message) ? "text-nevoa" : "text-pergaminho text-glow"
                }`}
              >
                {applyTokens(h.message, content.relationship)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setProgress(0);
                }}
                className="text-[0.7rem] uppercase tracking-[0.3em] text-nevoa/70 transition-colors hover:text-nevoa"
              >
                segurar de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
