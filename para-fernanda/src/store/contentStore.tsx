import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SiteContent } from "../types/content";
import { defaultContent } from "../data/defaultContent";

/**
 * Persistência simples em localStorage.
 * Estrutura pensada para migrar depois para Supabase/Firebase:
 * basta trocar loadContent/saveContent por chamadas remotas.
 */
const STORAGE_KEY = "para-fernanda:content:v1";

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (Array.isArray(base) || Array.isArray(override)) {
    return (override as T) ?? base;
  }
  if (typeof base === "object" && base && typeof override === "object" && override) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(override as Record<string, unknown>)) {
      const b = (base as Record<string, unknown>)[key];
      const o = (override as Record<string, unknown>)[key];
      out[key] =
        b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b) && !Array.isArray(o)
          ? deepMerge(b, o)
          : o !== undefined
            ? o
            : b;
    }
    return out as T;
  }
  return (override as T) ?? base;
}

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    // Mescla com o padrão para que novos campos nunca quebrem dados antigos
    return deepMerge(defaultContent, parsed);
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: SiteContent): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch {
    // Provável estouro de cota (fotos grandes em base64)
    return false;
  }
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportContent(): string {
  return JSON.stringify(loadContent(), null, 2);
}

export function importContent(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<SiteContent>;
    return saveContent(deepMerge(defaultContent, parsed));
  } catch {
    return false;
  }
}

interface ContentContextValue {
  content: SiteContent;
  update: (updater: (draft: SiteContent) => SiteContent) => void;
  replace: (next: SiteContent) => void;
  saveOk: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => loadContent());
  const [saveOk, setSaveOk] = useState(true);

  const replace = useCallback((next: SiteContent) => {
    setContent(next);
    setSaveOk(saveContent(next));
  }, []);

  const update = useCallback(
    (updater: (draft: SiteContent) => SiteContent) => {
      setContent((prev) => {
        const next = updater(structuredClone(prev));
        setSaveOk(saveContent(next));
        return next;
      });
    },
    []
  );

  // Sincroniza entre abas (ex.: painel aberto em uma aba, site em outra)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setContent(loadContent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Aplica o tema como CSS variables
  useEffect(() => {
    const t = content.theme;
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-soft", t.accentSoft);
    root.style.setProperty("--bg", t.background);
    root.style.setProperty("--surface", t.surface);
    document.title = content.meta.title;
  }, [content.theme, content.meta.title]);

  const value = useMemo(
    () => ({ content, update, replace, saveOk }),
    [content, update, replace, saveOk]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent deve ser usado dentro de <ContentProvider>");
  return ctx;
}

/** true quando um texto ainda é placeholder */
export function isPlaceholder(text: string): boolean {
  return /\[ADICIONAR [^\]]*\]/.test(text);
}
