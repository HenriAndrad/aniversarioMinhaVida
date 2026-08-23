import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Section } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

/** Partículas douradas subindo devagar — celebração sem confete berrante. */
function GoldenDust() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${(i * 7.3 + 4) % 100}%`,
            background: "var(--accent-soft)",
            opacity: 0.7,
          }}
          initial={{ y: "105vh" }}
          animate={{ y: "-5vh" }}
          transition={{
            duration: 14 + (i % 5) * 3,
            repeat: Infinity,
            delay: i * 1.7,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function BirthdaySection() {
  const { content } = useContent();
  const b = content.birthday;
  const date = formatDate(b.date);

  return (
    <Section id="aniversario">
      <GoldenDust />
      <div className="flex w-full max-w-3xl flex-col items-center gap-10 px-6 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-nevoa">
            {date ? `${date} · ` : ""}o dia em que você chegou ao mundo
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl italic leading-tight text-glow sm:text-6xl">
            <span className="font-accent">{b.title}</span>
          </h2>
        </Reveal>

        {b.photo && (
          <Reveal delay={0.2}>
            <div
              className="relative mx-auto w-64 overflow-hidden rounded-[2rem] sm:w-80"
              style={{ boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 25%, transparent)" }}
            >
              <img
                src={b.photo}
                alt={content.relationship.herName}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
        )}

        {b.age > 0 && (
          <Reveal delay={0.25}>
            <p className="font-display text-2xl text-pergaminho/90 sm:text-3xl">
              {b.age} anos de uma vida que deixa o mundo mais bonito.
            </p>
          </Reveal>
        )}

        <Reveal delay={0.3}>
          <p
            className={`mx-auto max-w-prose2 whitespace-pre-line text-base leading-relaxed sm:text-lg ${
              isPlaceholder(b.message) ? "text-nevoa" : "text-pergaminho/85"
            }`}
          >
            {b.message}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
