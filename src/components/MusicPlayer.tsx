import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "../store/contentStore";
import { assetUrl } from "../utils/media";

export interface MusicPlayerHandle {
  /** Chamado no clique de "Entrar no nosso mundo" — gesto do usuário libera o áudio */
  start: () => void;
  /** Troca suave de faixa por momento da experiência (se configurada) */
  setMood: (mood: "intro" | "memories" | "emotional" | "ending") => void;
}

/**
 * Player discreto no canto da tela.
 * - nunca dá autoplay sem interação;
 * - indicador visual quando está tocando;
 * - volume controlável;
 * - fade suave ao trocar de faixa.
 */
const MusicPlayer = forwardRef<MusicPlayerHandle, { visible: boolean }>(
  function MusicPlayer({ visible }, ref) {
    const { content } = useContent();
    const { music } = content;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeRaf = useRef(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(music.volume);
    const [showVolume, setShowVolume] = useState(false);
    const currentSrc = useRef<string>("");

    const hasMusic = Boolean(music.src || Object.values(music.bySection).some(Boolean));

    useEffect(() => {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
      return () => {
        audio.pause();
        cancelAnimationFrame(fadeRaf.current);
      };
    }, []);

    useEffect(() => {
      if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const fadeTo = (target: number, ms: number, done?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelAnimationFrame(fadeRaf.current);
      const from = audio.volume;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms);
        audio.volume = from + (target - from) * p;
        if (p < 1) fadeRaf.current = requestAnimationFrame(step);
        else done?.();
      };
      fadeRaf.current = requestAnimationFrame(step);
    };

    const play = async (src: string) => {
      const audio = audioRef.current;
      if (!audio || !src) return;
      if (currentSrc.current !== src) {
        currentSrc.current = src;
        audio.src = assetUrl(src) ?? src;
      }
      try {
        audio.volume = 0;
        await audio.play();
        fadeTo(volume, 1200);
        setPlaying(true);
      } catch {
        // Navegador bloqueou — o botão de play continua disponível
        setPlaying(false);
      }
    };

    useImperativeHandle(ref, () => ({
      start: () => {
        const src = music.bySection.intro || music.src;
        if (src) void play(src);
      },
      setMood: (mood) => {
        const next = music.bySection[mood] || music.src;
        const audio = audioRef.current;
        if (!audio || !next || !playing) return;
        if (currentSrc.current === next) return;
        fadeTo(0, 900, () => void play(next));
      },
    }));

    const toggle = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        fadeTo(0, 500, () => {
          audio.pause();
          setPlaying(false);
        });
      } else {
        void play(currentSrc.current || music.bySection.intro || music.src);
      }
    };

    if (!hasMusic || !visible) return null;

    return (
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass flex items-center rounded-full px-3 py-2"
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                aria-label="Volume da música"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-24 accent-[var(--accent)]"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setShowVolume((v) => !v)}
          aria-label="Ajustar volume"
          className="glass grid h-10 w-10 place-items-center rounded-full text-pergaminho/80 transition-colors hover:text-[var(--accent)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Tocar música"}
          className="glass relative grid h-12 w-12 place-items-center rounded-full text-pergaminho transition-colors hover:text-[var(--accent)]"
        >
          {playing && (
            <span
              className="absolute inset-0 animate-pulse rounded-full"
              style={{ boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 45%, transparent)" }}
              aria-hidden="true"
            />
          )}
          {playing ? (
            <span className="flex items-end gap-0.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-[var(--accent)]"
                  animate={{ height: [6, 14, 6] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                />
              ))}
            </span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

export default MusicPlayer;
