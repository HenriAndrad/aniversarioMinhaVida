import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export interface NavSection {
  id: string;
  label: string;
}

/**
 * Barra de progresso fina no topo + pontinhos discretos à direita (desktop).
 * Não compete com a narrativa; só orienta.
 */
export default function ProgressNav({ sections }: { sections: NavSection[] }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left"
        style={{ scaleX, background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
      />
      <nav
        aria-label="Seções"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={active === s.id ? "true" : undefined}
            className="group relative flex items-center justify-end"
          >
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-black/60 px-3 py-1 text-xs text-pergaminho/90 opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className="block h-2 w-2 rounded-full transition-all duration-300"
              style={{
                background: active === s.id ? "var(--accent)" : "rgba(240,234,224,0.25)",
                boxShadow: active === s.id ? "0 0 10px var(--accent)" : "none",
                transform: active === s.id ? "scale(1.4)" : "scale(1)",
              }}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
