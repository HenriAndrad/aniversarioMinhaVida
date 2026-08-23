import React from "react";
import { motion } from "framer-motion";

/** Fade + blur suave quando o elemento entra na viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Sequência de frases que aparecem uma a uma conforme o scroll,
 * com bastante espaço entre elas — o coração narrativo do site.
 */
export function LineSequence({
  lines,
  className = "",
  lineClassName = "",
  gap = "gap-16 sm:gap-24",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  gap?: string;
}) {
  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      {lines.map((line, i) => (
        <Reveal key={i} className="px-6">
          <p
            className={`mx-auto max-w-prose2 text-center font-display text-2xl leading-relaxed sm:text-3xl md:text-4xl ${lineClassName}`}
          >
            {line}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/** Casca de seção: tela cheia, conteúdo centralizado, ancorável. */
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={`relative z-10 flex min-h-screen flex-col items-center justify-center py-24 ${className}`}
    >
      {children}
    </section>
  );
}

/** Título de seção em itálico dourado, com brilho discreto. */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="mx-auto max-w-prose2 px-6 text-center font-display text-3xl italic text-glow sm:text-4xl md:text-5xl">
        <span className="font-accent">{children}</span>
      </h2>
    </Reveal>
  );
}
