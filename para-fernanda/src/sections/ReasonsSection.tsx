import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import Modal from "../components/Modal";
import { useContent, isPlaceholder } from "../store/contentStore";
import type { Reason } from "../types/content";

/**
 * "Por que eu amo você" — cada motivo é uma estrela na constelação.
 * As estrelas flutuam suavemente; tocar em uma abre o motivo.
 */
export default function ReasonsSection() {
  const { content } = useContent();
  const [open, setOpen] = useState<Reason | null>(null);
  const reduced = useReducedMotion();

  // Posições determinísticas e espalhadas (mesmo layout em cada visita)
  const positions = useMemo(() => {
    const n = content.reasons.length;
    return content.reasons.map((_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const jitterX = ((i * 37) % 20) - 10;
      const jitterY = ((i * 53) % 18) - 9;
      return {
        x: 12 + col * 33 + jitterX, // % da largura
        y: 8 + row * (74 / Math.max(1, Math.ceil(n / 3))) + jitterY, // % da altura
      };
    });
  }, [content.reasons]);

  return (
    <Section id="motivos">
      <SectionTitle>Por que eu amo você</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 px-6 text-center text-sm text-nevoa">
          Cada estrela guarda um motivo. Toque nelas.
        </p>
      </Reveal>

      <div className="relative mt-10 h-[26rem] w-full max-w-3xl px-6 sm:h-[30rem]">
        {content.reasons.map((r, i) => {
          const pos = positions[i];
          return (
            <motion.button
              key={r.id}
              type="button"
              onClick={() => setOpen(r)}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={reduced ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              aria-label={`Motivo: ${r.title}`}
            >
              <span
                aria-hidden="true"
                className="grid h-4 w-4 place-items-center rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{
                  background: "var(--accent-soft)",
                  boxShadow: "0 0 16px var(--accent), 0 0 40px color-mix(in srgb, var(--accent) 40%, transparent)",
                }}
              />
              <span className="whitespace-nowrap font-display text-sm italic text-pergaminho/75 transition-colors group-hover:text-[var(--accent-soft)] sm:text-base">
                {r.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} label={open?.title ?? "Motivo"}>
        {open && (
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ background: "var(--accent-soft)", boxShadow: "0 0 20px var(--accent)" }}
            />
            <h3 className="font-display text-3xl italic">
              <span className="font-accent">{open.title}</span>
            </h3>
            {open.image && (
              <img
                src={open.image}
                alt=""
                loading="lazy"
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            )}
            <p
              className={`whitespace-pre-line text-sm leading-relaxed sm:text-base ${
                isPlaceholder(open.text) ? "text-nevoa" : "text-pergaminho/85"
              }`}
            >
              {open.text}
            </p>
          </div>
        )}
      </Modal>
    </Section>
  );
}
