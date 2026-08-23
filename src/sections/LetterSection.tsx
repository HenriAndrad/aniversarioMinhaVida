import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";

/**
 * A carta. Um envelope fechado; ao tocar, ele se abre e o papel
 * sobe, com os parágrafos surgindo um a um.
 */
export default function LetterSection() {
  const { content } = useContent();
  const letter = content.loveLetter;
  const [opened, setOpened] = useState(false);

  return (
    <Section id="carta">
      <SectionTitle>{letter.title}</SectionTitle>

      <div className="mt-14 w-full max-w-xl px-6">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="envelope"
              type="button"
              onClick={() => setOpened(true)}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="group relative mx-auto block w-full max-w-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Abrir a carta"
            >
              <div
                className="glass relative overflow-hidden rounded-2xl pb-[62%] transition-shadow duration-700"
                style={{ boxShadow: "0 10px 60px rgba(0,0,0,0.5)" }}
              >
                {/* aba do envelope */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-700 group-hover:[transform:rotateX(28deg)]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 96%)",
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--surface) 88%, white), var(--surface))",
                    borderBottom: "1px solid rgba(240,234,224,0.1)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-lg italic"
                  style={{
                    background: "var(--accent)",
                    color: "#171207",
                    boxShadow: "0 0 30px color-mix(in srgb, var(--accent) 55%, transparent)",
                  }}
                >
                  F
                </span>
              </div>
              <p className="mt-5 text-center text-xs uppercase tracking-[0.3em] text-nevoa">
                toque para abrir
              </p>
            </motion.button>
          ) : (
            <motion.article
              key="paper"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-7 sm:p-10"
            >
              {letter.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.5 }}
                  className={`mb-5 whitespace-pre-line font-display text-lg leading-relaxed sm:text-xl ${
                    isPlaceholder(p) ? "text-nevoa" : "text-pergaminho/90"
                  }`}
                >
                  {p}
                </motion.p>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 + letter.paragraphs.length * 0.5 }}
                className="mt-8 text-right font-display text-xl italic"
              >
                <span className="font-accent">{letter.signature}</span>
              </motion.p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
