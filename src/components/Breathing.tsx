import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "../store/contentStore";

type Phase = "inhale" | "hold" | "exhale";

/**
 * "Respira comigo": um círculo que cresce e diminui no ritmo certo.
 * Ela toca uma vez e acompanha. Nada de contador de ansiedade,
 * nada de cobrança — só um ritmo para acompanhar.
 */
export default function Breathing() {
  const { content } = useContent();
  const b = content.breathing;
  const reduced = useReducedMotion();

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycle, setCycle] = useState(0);
  const timer = useRef<number>();

  const durations: Record<Phase, number> = {
    inhale: Math.max(1, b.inhaleSeconds),
    hold: Math.max(0, b.holdSeconds),
    exhale: Math.max(1, b.exhaleSeconds),
  };
  const labels: Record<Phase, string> = {
    inhale: b.inhale,
    hold: b.hold,
    exhale: b.exhale,
  };

  useEffect(() => {
    if (!running) return;
    const next: Record<Phase, Phase> = { inhale: "hold", hold: "exhale", exhale: "inhale" };
    const seconds = durations[phase] || 0.01;

    timer.current = window.setTimeout(() => {
      const following = next[phase];
      // pula a pausa se ela estiver zerada
      const target = following === "hold" && durations.hold === 0 ? "exhale" : following;
      if (phase === "exhale") {
        const c = cycle + 1;
        if (c >= Math.max(1, b.cycles)) {
          setRunning(false);
          setDone(true);
          return;
        }
        setCycle(c);
      }
      setPhase(target);
    }, seconds * 1000);

    return () => window.clearTimeout(timer.current);
  }, [running, phase, cycle, b.cycles, durations.hold]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const scale = phase === "inhale" ? 1 : phase === "hold" ? 1 : 0.62;

  const start = () => {
    setDone(false);
    setCycle(0);
    setPhase("inhale");
    setRunning(true);
  };

  if (!b.enabled) return null;

  return (
    <div className="flex flex-col items-center gap-6 px-6 text-center">
      <div className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64">
        {/* halo */}
        <motion.span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 68%)",
          }}
          animate={running && !reduced ? { scale: scale * 1.05, opacity: 0.9 } : { scale: 0.8, opacity: 0.5 }}
          transition={{ duration: running ? durations[phase] : 1, ease: "easeInOut" }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute rounded-full border"
          style={{
            width: "62%",
            height: "62%",
            borderColor: "color-mix(in srgb, var(--accent) 55%, transparent)",
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
          animate={running && !reduced ? { scale } : { scale: 0.85 }}
          transition={{ duration: running ? durations[phase] : 1, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-1">
          <AnimatePresence mode="wait">
            {running ? (
              <motion.span
                key={phase + cycle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display text-2xl italic text-pergaminho"
              >
                {labels[phase]}
              </motion.span>
            ) : (
              <motion.button
                key="start"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={start}
                className="btn-ghost !px-6 !py-2 text-xs"
              >
                {done ? "de novo" : b.label}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {done && b.endMessage && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-prose2 font-display text-xl italic text-pergaminho/90"
          >
            {b.endMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {running && (
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            window.clearTimeout(timer.current);
          }}
          className="text-[0.7rem] uppercase tracking-[0.3em] text-nevoa/70 transition-colors hover:text-nevoa"
        >
          parar
        </button>
      )}
    </div>
  );
}
