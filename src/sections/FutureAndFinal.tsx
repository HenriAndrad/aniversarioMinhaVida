import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, LineSequence, Section, SectionTitle } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";
import { useTimeTogether } from "../hooks/useTimeTogether";
import { applyTokens } from "../utils/text";

/**
 * Estrela cadente: ela toca o céu, um pedido atravessa a tela
 * e a mensagem aparece em seguida.
 */
function WishStar() {
  const { content } = useContent();
  const w = content.wish;
  const reduced = useReducedMotion();
  const [wished, setWished] = useState(false);
  const [flying, setFlying] = useState(false);

  if (!w.enabled) return null;

  const wish = () => {
    if (wished) return;
    setFlying(true);
    window.setTimeout(() => {
      setFlying(false);
      setWished(true);
    }, reduced ? 200 : 1500);
  };

  return (
    <div className="relative mt-24 w-full px-6">
      <AnimatePresence>
        {flying && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-0 h-[2px] w-24 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent))",
              boxShadow: "0 0 14px color-mix(in srgb, var(--accent) 70%, transparent)",
            }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 22 }}
            animate={{ x: ["0%", "560%"], y: [0, 150], opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.4, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {!wished ? (
        <Reveal>
          <button
            type="button"
            onClick={wish}
            className="mx-auto block text-center text-[0.7rem] uppercase tracking-[0.3em] text-nevoa transition-colors hover:text-pergaminho"
          >
            {applyTokens(w.prompt, content.relationship)}
          </button>
        </Reveal>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto max-w-prose2 text-center font-display text-xl italic leading-relaxed sm:text-2xl ${
            isPlaceholder(w.message) ? "text-nevoa" : "text-pergaminho/90"
          }`}
        >
          {applyTokens(w.message, content.relationship)}
        </motion.p>
      )}
    </div>
  );
}

/** "E isso é só o começo." — esperança e futuro. */
export function FutureSection() {
  const { content } = useContent();
  const f = content.future;
  return (
    <Section id="futuro">
      <SectionTitle>{f.title}</SectionTitle>
      <div className="mt-24">
        <LineSequence lines={f.lines} lineClassName="text-pergaminho/85" />
      </div>
      <Reveal className="mt-28">
        <p className="px-6 text-center font-display text-4xl italic text-glow sm:text-6xl">
          <span className="font-accent">{f.closing}</span>
        </p>
      </Reveal>
    </Section>
  );
}

function CounterUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-display text-3xl tabular-nums sm:text-5xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-nevoa sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/** Encerramento: silencioso, cinematográfico, com o contador vivo. */
export function FinalSection() {
  const { content } = useContent();
  const f = content.final;
  const t = useTimeTogether(content.relationship.startDate);

  return (
    <Section id="final" className="pb-40">
      <LineSequence
        lines={f.lines}
        gap="gap-24 sm:gap-32"
        lineClassName="italic"
      />

      <Reveal className="mt-32">
        <p className="px-6 text-center font-display text-5xl italic text-glow sm:text-7xl">
          <span className="font-accent">{f.love}</span> <span aria-hidden="true">❤️</span>
        </p>
      </Reveal>

      <div className="mt-32 flex flex-col gap-10">
        {f.promise.split("\n").map((line, i) => (
          <Reveal key={i}>
            <p className="mx-auto max-w-prose2 px-6 text-center font-display text-2xl leading-relaxed text-pergaminho/80 sm:text-3xl">
              {line}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-32">
        <p className="mx-auto max-w-prose2 px-6 text-center font-display text-3xl italic leading-snug text-glow sm:text-5xl">
          <span className="font-accent">{f.closing}</span>
        </p>
      </Reveal>

      <Reveal className="mt-24">
        <p className="text-center font-display text-xl italic text-pergaminho/85 sm:text-2xl">
          {applyTokens(f.birthdayLine, content.relationship)}
        </p>
      </Reveal>

      {t.valid ? (
        <Reveal className="mt-20">
          <div className="glass mx-6 rounded-3xl px-8 py-6">
            <p className="mb-4 text-center text-[0.65rem] uppercase tracking-[0.3em] text-nevoa">
              {f.counterLabel}
            </p>
            <div className="flex items-start justify-center gap-5 sm:gap-9">
              <CounterUnit value={t.days} label="dias" />
              <CounterUnit value={t.hours} label="horas" />
              <CounterUnit value={t.minutes} label="min" />
              <CounterUnit value={t.seconds} label="seg" />
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal className="mt-20">
          <p className="text-center text-xs text-nevoa">
            [ADICIONAR DATA] Configure a data de início no painel para ativar o contador.
          </p>
        </Reveal>
      )}

      <WishStar />
    </Section>
  );
}
