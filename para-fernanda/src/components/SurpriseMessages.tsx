import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "../store/contentStore";

/**
 * Pequenas mensagens que surgem de vez em quando, sem atrapalhar.
 * - primeira após ~45s, depois a cada ~90s;
 * - somem sozinhas;
 * - nunca duas seguidas iguais.
 */
export default function SurpriseMessages({ active }: { active: boolean }) {
  const { content } = useContent();
  const messages = content.surpriseMessages.filter(Boolean);
  const [current, setCurrent] = useState<string | null>(null);
  const lastIndex = useRef(-1);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || messages.length === 0) return;

    let hideTimer = 0;
    const show = () => {
      let i = Math.floor(Math.random() * messages.length);
      if (messages.length > 1 && i === lastIndex.current) i = (i + 1) % messages.length;
      lastIndex.current = i;
      setCurrent(messages[i]);
      hideTimer = window.setTimeout(() => setCurrent(null), 6000);
    };

    const first = window.setTimeout(show, 45000);
    const interval = window.setInterval(show, 95000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, [active, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-40 flex justify-center px-4">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.7 }}
            className="glass max-w-sm rounded-2xl px-5 py-3 text-center"
            role="status"
          >
            <p className="font-display text-base italic text-pergaminho/90">
              {current} <span className="font-accent">♥</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
