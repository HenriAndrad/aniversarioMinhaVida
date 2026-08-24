import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import Modal from "../components/Modal";
import { useContent, isPlaceholder } from "../store/contentStore";
import { assetUrl } from "../utils/media";
import type { VideoItem } from "../types/content";

/** Vídeos guardados: capa discreta, player só quando ela pedir. */
export default function VideoSection() {
  const { content } = useContent();
  const v = content.videos;
  const [open, setOpen] = useState<VideoItem | null>(null);

  const items = v.items.filter((i) => i.src.trim() !== "");
  if (!v.enabled || items.length === 0) return null;

  return (
    <Section id="videos">
      <SectionTitle>{v.title}</SectionTitle>

      {v.intro && !isPlaceholder(v.intro) && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-prose2 px-6 text-center text-sm leading-relaxed text-nevoa sm:text-base">
            {v.intro}
          </p>
        </Reveal>
      )}

      <div className="mx-auto mt-12 grid w-full max-w-3xl gap-5 px-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => setOpen(item)}
              className="group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label={`Assistir: ${item.title}`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-superficie">
                {item.poster ? (
                  <img
                    src={assetUrl(item.poster)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={assetUrl(item.src)}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <motion.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full backdrop-blur-sm"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 88%, transparent)",
                    color: "#171207",
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.span>
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-display text-lg italic text-pergaminho">
                    {item.title}
                  </span>
                  {item.date && !isPlaceholder(item.date) && (
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.25em] text-nevoa">
                      {item.date}
                    </span>
                  )}
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} label={open?.title ?? "Vídeo"}>
        {open && (
          <div className="flex flex-col gap-4">
            <video
              src={assetUrl(open.src)}
              poster={assetUrl(open.poster)}
              controls
              autoPlay
              playsInline
              className="w-full rounded-2xl"
            />
            <h3 className="font-display text-2xl italic">
              <span className="font-accent">{open.title}</span>
            </h3>
            {open.message && (
              <p
                className={`whitespace-pre-line text-sm leading-relaxed sm:text-base ${
                  isPlaceholder(open.message) ? "text-nevoa" : "text-pergaminho/85"
                }`}
              >
                {open.message}
              </p>
            )}
          </div>
        )}
      </Modal>
    </Section>
  );
}
