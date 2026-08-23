import { useState } from "react";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import Modal from "../components/Modal";
import { useContent, isPlaceholder } from "../store/contentStore";
import type { Memory } from "../types/content";

/**
 * "Momentos que eu guardo" — não é uma grade fria de fotos.
 * Cada memória abre um cartão com título, data e o que aquele momento significou.
 */
export default function MemoriesSection() {
  const { content } = useContent();
  const [open, setOpen] = useState<Memory | null>(null);

  return (
    <Section id="momentos">
      <SectionTitle>Momentos que eu guardo</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 px-6 text-center text-sm text-nevoa">
          Algumas fotos parecem simples. Nenhuma delas é.
        </p>
      </Reveal>

      <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-4 px-6 sm:grid-cols-3">
        {content.memories.map((m, i) => (
          <Reveal key={m.id} delay={(i % 3) * 0.08}>
            <button
              type="button"
              onClick={() => setOpen(m)}
              className="group relative block w-full overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label={`Memória: ${m.title}`}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="glass grid aspect-square w-full place-items-center">
                  <span className="px-3 text-center text-xs text-nevoa">[ADICIONAR FOTO]</span>
                </div>
              )}
              <span
                className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              >
                <span className="font-display text-sm italic text-pergaminho">{m.title}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} label={open?.title ?? "Memória"}>
        {open && (
          <div className="flex flex-col gap-4">
            {open.image && (
              <img
                src={open.image}
                alt={open.title}
                loading="lazy"
                className="max-h-80 w-full rounded-2xl object-cover"
              />
            )}
            <p className="text-xs uppercase tracking-widest text-nevoa">
              {isPlaceholder(open.date) ? "" : open.date}
            </p>
            <h3 className="font-display text-2xl italic">
              <span className="font-accent">{open.title}</span>
            </h3>
            <p
              className={`whitespace-pre-line text-sm leading-relaxed ${
                isPlaceholder(open.message) ? "text-nevoa" : "text-pergaminho/85"
              }`}
            >
              {open.message}
            </p>
          </div>
        )}
      </Modal>
    </Section>
  );
}
