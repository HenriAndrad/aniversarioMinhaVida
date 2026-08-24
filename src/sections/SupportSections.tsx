import { useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { LineSequence, Reveal, Section } from "../components/Reveal";
import { useContent } from "../store/contentStore";
import Breathing from "../components/Breathing";

/**
 * "Quando tudo parecer pesado..." — o refúgio do site.
 * Mais silencioso, mais escuro, mais espaço. Uma frase de cada vez.
 */
export function HeavyDaysSection() {
  const { content } = useContent();
  const s = content.heavyDays;
  return (
    <Section id="refugio" className="bg-gradient-to-b from-transparent via-black/40 to-transparent">
      <Reveal>
        <h2 className="mx-auto max-w-prose2 px-6 text-center font-display text-3xl italic text-pergaminho/70 sm:text-4xl">
          {s.title}
        </h2>
      </Reveal>
      <div className="mt-32">
        <LineSequence
          lines={s.lines}
          gap="gap-24 sm:gap-32"
          lineClassName="text-pergaminho/85 font-light"
        />
      </div>
      <div className="mt-32">
        <Reveal>
          <Breathing />
        </Reveal>
      </div>
    </Section>
  );
}

/** "Nos dias bons e nos dias ruins" */
export function GoodAndBadDaysSection() {
  const { content } = useContent();
  const s = content.goodAndBadDays;
  const [first, ...rest] = s.lines;
  const closing = rest.slice(-2);
  const middle = rest.slice(0, -2);

  return (
    <Section id="dias">
      <Reveal>
        <p className="mx-auto max-w-prose2 px-6 text-center font-display text-2xl italic leading-relaxed sm:text-4xl">
          {first}
        </p>
      </Reveal>
      <div className="mt-24">
        <LineSequence lines={middle} lineClassName="text-pergaminho/80" />
      </div>
      <div className="mt-28 flex flex-col gap-10">
        {closing.map((line, i) => (
          <Reveal key={i}>
            <p className="mx-auto max-w-prose2 px-6 text-center font-display text-2xl italic text-glow sm:text-4xl">
              <span className="font-accent">{line}</span>
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/**
 * "Você consegue" — a luz do céu inteiro cresce conforme ela lê.
 * A sensação: esperança aumentando.
 */
export function YouCanSection() {
  const { content } = useContent();
  const s = content.youCan;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 10%"],
  });
  // Cresce durante a leitura e assenta num brilho suave que permanece
  const light = useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 0.3]);

  useMotionValueEvent(light, "change", (v) => {
    document.documentElement.style.setProperty("--sky-light", String(v * 0.8));
  });

  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty("--sky-light", "0");
    };
  }, []);

  return (
    <Section id="forca">
      <div ref={ref} className="relative w-full">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[60vh] w-[60vh] -translate-y-1/2 rounded-full blur-3xl"
          style={{
            opacity: light,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
          }}
        />
        <LineSequence
          lines={s.lines}
          gap="gap-20 sm:gap-28"
          lineClassName="italic"
        />
      </div>
    </Section>
  );
}
