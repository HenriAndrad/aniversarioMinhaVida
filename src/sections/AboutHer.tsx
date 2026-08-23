import { Reveal, LineSequence, Section } from "../components/Reveal";
import { useContent, isPlaceholder } from "../store/contentStore";

export default function AboutHer() {
  const { content } = useContent();
  const { intro, qualities } = content.aboutHer;

  return (
    <Section id="voce">
      <LineSequence lines={intro} lineClassName="italic" />

      <div className="mt-28 grid w-full max-w-3xl gap-6 px-6 sm:grid-cols-2">
        {qualities.map((q, i) => (
          <Reveal key={i} delay={i * 0.08} className={i === qualities.length - 1 && qualities.length % 2 ? "sm:col-span-2 sm:mx-auto sm:max-w-md" : ""}>
            <div className="glass h-full rounded-3xl p-6 text-center transition-transform duration-500 hover:-translate-y-1">
              <p className="mb-2 font-display text-xl italic">
                <span className="font-accent">{q.title}</span>
              </p>
              <p className={`text-sm leading-relaxed ${isPlaceholder(q.text) ? "text-nevoa" : "text-pergaminho/80"}`}>
                {q.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
