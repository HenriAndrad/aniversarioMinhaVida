import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Section, SectionTitle } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";
import { assetUrl } from "../utils/media";
import type { VoiceNote } from "../types/content";

function format(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Player pequeno, sem cara de player de sistema. */
function VoicePlayer({ note, onPlay, playingId }: { note: VoiceNote; onPlay: (id: string) => void; playingId: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const playing = playingId === note.id;

  // Só um áudio toca por vez
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [playing]);

  const bars = 28;

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onPlay(playing ? "" : note.id)}
          aria-label={playing ? `Pausar ${note.title}` : `Ouvir ${note.title}`}
          className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform hover:scale-105"
          style={{
            background: "color-mix(in srgb, var(--accent) 88%, transparent)",
            color: "#171207",
            boxShadow: playing ? "0 0 30px color-mix(in srgb, var(--accent) 45%, transparent)" : "none",
          }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg italic text-pergaminho">{note.title}</h3>
          {note.description && (
            <p className={`text-xs leading-relaxed ${isPlaceholder(note.description) ? "text-nevoa" : "text-pergaminho/70"}`}>
              {note.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: bars }).map((_, i) => {
                const active = progress * bars > i;
                // altura determinística, parece uma onda de voz
                const h = 30 + Math.abs(Math.sin(i * 1.7)) * 70;
                return (
                  <motion.span
                    key={i}
                    className="w-full rounded-full"
                    style={{
                      height: `${h}%`,
                      background: active
                        ? "color-mix(in srgb, var(--accent) 90%, transparent)"
                        : "rgba(240,234,224,0.16)",
                    }}
                    animate={playing && active ? { scaleY: [1, 0.7, 1] } : { scaleY: 1 }}
                    transition={{ duration: 0.9, repeat: playing ? Infinity : 0, delay: i * 0.03 }}
                  />
                );
              })}
            </div>
            <span className="shrink-0 font-mono text-[0.65rem] text-nevoa">
              {format(current)} / {format(duration)}
            </span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={assetUrl(note.src)}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          setCurrent(e.currentTarget.currentTime);
          setProgress(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0);
        }}
        onEnded={() => {
          onPlay("");
          setProgress(0);
          setCurrent(0);
        }}
      />
    </div>
  );
}

/**
 * "Quando quiser me ouvir": a voz dele, gravada, para os dias em que
 * ler não é suficiente.
 */
export default function VoiceSection() {
  const { content } = useContent();
  const v = content.voice;
  const [playingId, setPlayingId] = useState<string | null>(null);

  const items = v.items.filter((i) => i.src.trim() !== "");
  if (!v.enabled || items.length === 0) return null;

  return (
    <Section id="voz">
      <SectionTitle>{v.title}</SectionTitle>

      {v.intro && !isPlaceholder(v.intro) && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-prose2 px-6 text-center text-sm leading-relaxed text-nevoa sm:text-base">
            {v.intro}
          </p>
        </Reveal>
      )}

      <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-4 px-6">
        {items.map((note, i) => (
          <Reveal key={note.id} delay={i * 0.08}>
            <VoicePlayer
              note={note}
              playingId={playingId}
              onPlay={(id) => setPlayingId(id || null)}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
