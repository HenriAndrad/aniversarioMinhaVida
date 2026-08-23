import { Reveal, LineSequence, Section, SectionTitle } from "../components/Reveal";
import { useContent } from "../store/contentStore";
import { useTimeTogether } from "../hooks/useTimeTogether";

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
          <span className="font-accent">Eu te amo.</span> <span aria-hidden="true">❤️</span>
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
          Feliz aniversário, meu amor.
        </p>
      </Reveal>

      {t.valid ? (
        <Reveal className="mt-20">
          <div className="glass mx-6 rounded-3xl px-8 py-6">
            <p className="mb-4 text-center text-[0.65rem] uppercase tracking-[0.3em] text-nevoa">
              juntos há
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
    </Section>
  );
}
