import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, Section } from "../components/Reveal";
import { useContent } from "../store/contentStore";

/**
 * Um cartão discreto. Ao abrir, a tela escurece e as frases
 * chegam devagar, uma de cada vez — como um abraço em texto.
 */
export default function OpenWhenNeeded() {
  const { content } = useContent();
  const s = content.openWhenNeeded;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const done = step >= s.lines.length - 1;

  useEffect(() => {
    if (!open) return;
    setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open || done) return;
    const id = window.setTimeout(() => setStep((v) => v + 1), reduced ? 800 : 3400);
    return () => window.clearTimeout(id);
  }, [open, step, done, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Section id="abraco">
      <Reveal>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="glass group relative mx-6 flex max-w-sm flex-col items-center gap-4 rounded-[2rem] px-10 py-12 text-center transition-all duration-500 hover:-translate-y-1"
          style={{ boxShadow: "0 0 0 transparent" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ boxShadow: "0 0 50px color-mix(in srgb, var(--accent) 30%, transparent)" }}
          />
          <span aria-hidden="true" className="font-display text-3xl text-glow">
            <span className="font-accent">✉</span>
          </span>
          <span className="font-display text-2xl italic">{s.title}</span>
          <span className="text-xs uppercase tracking-[0.25em] text-nevoa">toque para abrir</span>
        </button>
      </Reveal>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={s.title}
          >
            <div className="flex min-h-[8rem] w-full max-w-prose2 items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: reduced ? 0.1 : 1.4 }}
                  className={`text-center font-display leading-relaxed ${
                    done ? "text-4xl italic text-glow sm:text-5xl" : "text-2xl sm:text-3xl"
                  }`}
                >
                  {done ? <span className="font-accent">{s.lines[step]}</span> : s.lines[step]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-10 flex gap-6">
              {!done && (
                <button
                  type="button"
                  onClick={() => setStep(s.lines.length - 1)}
                  className="text-xs tracking-widest text-nevoa/60 transition-colors hover:text-nevoa"
                >
                  ir até o fim
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs tracking-widest text-nevoa transition-colors hover:text-pergaminho"
              >
                fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
