import { useState } from "react";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import Modal from "../components/Modal";
import { useContent, isPlaceholder } from "../store/contentStore";
import type { TimelineEvent } from "../types/content";

/**
 * Nossa história — linha vertical com pontos de luz.
 * Cada evento abre uma visualização elegante em modal.
 */
export default function TimelineSection() {
  const { content } = useContent();
  const [open, setOpen] = useState<TimelineEvent | null>(null);

  return (
    <Section id="historia">
      <SectionTitle>Nossa história</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 px-6 text-center text-sm text-nevoa">
          Toque em cada momento para reviver.
        </p>
      </Reveal>

      <div className="relative mt-16 w-full max-w-2xl px-6">
        {/* linha central */}
        <div
          aria-hidden="true"
          className="absolute left-[30px] top-0 h-full w-px sm:left-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent)",
          }}
        />

        <ol className="flex flex-col gap-12">
          {content.timeline.map((ev, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={ev.id} className="relative">
                <li
                  className={`relative flex items-start gap-5 sm:w-1/2 ${
                    left ? "sm:pr-10" : "sm:ml-auto sm:flex-row-reverse sm:pl-10 sm:text-right"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`relative z-10 mt-1 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                      left ? "sm:absolute sm:-right-[7px] sm:mr-0" : "sm:absolute sm:-left-[7px]"
                    }`}
                    style={{
                      background: ev.highlight ? "var(--accent)" : "rgba(240,234,224,0.4)",
                      boxShadow: ev.highlight ? "0 0 14px var(--accent)" : "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setOpen(ev)}
                    className={`glass w-full rounded-2xl p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                      left ? "" : "sm:text-right"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest text-nevoa">
                      {isPlaceholder(ev.date) ? "· · ·" : ev.date}
                    </p>
                    <p className="mt-1 font-display text-xl italic">
                      <span className={ev.highlight ? "font-accent" : ""}>{ev.title}</span>
                    </p>
                  </button>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} label={open?.title ?? "Momento"}>
        {open && (
          <div className="flex flex-col gap-4">
            {open.image && (
              <img
                src={open.image}
                alt={open.title}
                loading="lazy"
                className="max-h-72 w-full rounded-2xl object-cover"
              />
            )}
            {open.video && (
              <video src={open.video} controls className="w-full rounded-2xl" preload="metadata" />
            )}
            <p className="text-xs uppercase tracking-widest text-nevoa">
              {isPlaceholder(open.date) ? "" : open.date}
            </p>
            <h3 className="font-display text-2xl italic">
              <span className="font-accent">{open.title}</span>
            </h3>
            <p
              className={`whitespace-pre-line text-sm leading-relaxed ${
                isPlaceholder(open.description) ? "text-nevoa" : "text-pergaminho/85"
              }`}
            >
              {open.description}
            </p>
          </div>
        )}
      </Modal>
    </Section>
  );
}
