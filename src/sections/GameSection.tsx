import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Section } from "../components/Reveal";
import { useContent } from "../store/contentStore";

type Stage = "question" | "wrong" | "explain" | "infinity";

/**
 * Uma brincadeira: qualquer resposta está "errada",
 * porque não existe opção grande o suficiente. ∞
 */
export default function GameSection() {
  const { content } = useContent();
  const g = content.game;
  const [stage, setStage] = useState<Stage>("question");

  const answer = () => {
    setStage("wrong");
    window.setTimeout(() => setStage("explain"), 1600);
    window.setTimeout(() => setStage("infinity"), 3600);
  };

  return (
    <Section id="jogo">
      <div className="flex min-h-[22rem] w-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "question" && (
            <motion.div
              key="q"
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center gap-8"
            >
              <Reveal>
                <p className="font-display text-3xl italic sm:text-4xl">
                  {g.question}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-wrap justify-center gap-3">
                  {g.options.map((opt) => (
                    <button key={opt} type="button" className="btn-ghost" onClick={answer}>
                      {opt}
                    </button>
                  ))}
                </div>
              </Reveal>
            </motion.div>
          )}

          {stage === "wrong" && (
            <motion.p
              key="w"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-display text-4xl italic"
            >
              {g.wrong}
            </motion.p>
          )}

          {stage === "explain" && (
            <motion.p
              key="e"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-prose2 font-display text-2xl italic leading-relaxed sm:text-3xl"
            >
              {g.explain}
            </motion.p>
          )}

          {stage === "infinity" && (
            <motion.div
              key="i"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <span
                className="font-display text-8xl text-glow sm:text-9xl"
                aria-label="Infinito"
              >
                <span className="font-accent">∞</span>
              </span>
              <button
                type="button"
                onClick={() => setStage("question")}
                className="text-xs uppercase tracking-[0.3em] text-nevoa transition-colors hover:text-pergaminho"
              >
                {g.retry}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
