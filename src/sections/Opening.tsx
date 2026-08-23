import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "../store/contentStore";

/**
 * Abertura: tela cheia, silenciosa, frases surgindo uma a uma.
 * O botão final inicia a música (gesto do usuário) e revela o site.
 */
export default function Opening({ onEnter }: { onEnter: () => void }) {
  const { content } = useContent();
  const nickname = content.relationship.nickname || content.relationship.herName;
  const reduced = useReducedMotion();

  const lines = [
    "Hoje não é um dia qualquer...",
    "Hoje é o dia de celebrar você.",
    content.relationship.herName + ".",
    "Feliz aniversário.",
  ];

  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = step >= lines.length;

  useEffect(() => {
    if (done) return;
    const delay = reduced ? 600 : step === 0 ? 1400 : 2600;
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    return () => window.clearTimeout(id);
  }, [step, done, reduced]);

  const enter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, reduced ? 50 : 1200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
      animate={leaving ? { opacity: 0, filter: "blur(12px)" } : {}}
      transition={{ duration: 1.1, ease: "easeInOut" }}
    >
      <p className="mb-10 font-body text-xs uppercase tracking-[0.35em] text-nevoa">
        {nickname}, eu fiz uma coisa para você
      </p>

      <div className="flex min-h-[10rem] items-center justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              transition={{ duration: reduced ? 0.1 : 1 }}
              className={`max-w-prose2 text-center font-display leading-snug ${
                step >= 2 ? "text-4xl italic text-glow sm:text-6xl" : "text-3xl sm:text-5xl"
              }`}
            >
              {step >= 2 ? <span className="font-accent">{lines[step]}</span> : lines[step]}
            </motion.p>
          ) : (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <p className="font-display text-4xl italic text-glow sm:text-6xl">
                <span className="font-accent">Feliz aniversário.</span>
              </p>
              <button type="button" className="btn-primary" onClick={enter}>
                Entrar no nosso mundo
                <span aria-hidden="true">❤️</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <button
          type="button"
          onClick={() => setStep(lines.length)}
          className="absolute bottom-8 text-xs tracking-widest text-nevoa/60 transition-colors hover:text-nevoa"
        >
          pular
        </button>
      )}
    </motion.div>
  );
}
