import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";
import { applyTokens } from "../utils/text";

/**
 * Ela escolhe como está se sentindo agora e recebe a mensagem escrita
 * para aquele estado. É a parte do site que ela pode voltar a usar em
 * qualquer dia ruim — por isso as respostas nunca tentam consertar nada.
 */
export default function MoodSection() {
  const { content } = useContent();
  const m = content.mood;
  const [openId, setOpenId] = useState<string | null>(null);

  if (!m.enabled || m.options.length === 0) return null;
  const selected = m.options.find((o) => o.id === openId) ?? null;

  return (
    <Section id="como-esta">
      <SectionTitle>{m.title}</SectionTitle>

      {m.question && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-prose2 px-6 text-center text-sm leading-relaxed text-nevoa sm:text-base">
            {applyTokens(m.question, content.relationship)}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.2} className="mt-10 w-full px-6">
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
          {m.options.map((o) => {
            const active = o.id === openId;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOpenId(active ? null : o.id)}
                aria-pressed={active}
                className="rounded-full px-5 py-2.5 text-sm transition-all duration-500"
                style={{
                  background: active
                    ? "color-mix(in srgb, var(--accent) 88%, transparent)"
                    : "rgba(240,234,224,0.06)",
                  color: active ? "#171207" : "#F0EAE0",
                  border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                  boxShadow: active
                    ? "0 0 34px color-mix(in srgb, var(--accent) 35%, transparent)"
                    : "none",
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-10 min-h-[9rem] w-full px-6">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass mx-auto max-w-xl rounded-3xl p-6 text-center sm:p-8"
            >
              <p
                className={`whitespace-pre-line font-display text-xl italic leading-relaxed sm:text-2xl ${
                  isPlaceholder(selected.message) ? "text-nevoa" : "text-pergaminho"
                }`}
              >
                {applyTokens(selected.message, content.relationship)}
              </p>
              {selected.closing && (
                <p className="mt-5 text-xs uppercase tracking-[0.25em] text-nevoa">
                  {applyTokens(selected.closing, content.relationship)}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {m.footer && (
        <Reveal delay={0.1}>
          <p className="mt-4 px-6 text-center font-display text-lg italic text-glow">
            <span className="font-accent">{applyTokens(m.footer, content.relationship)}</span>
          </p>
        </Reveal>
      )}
    </Section>
  );
}
