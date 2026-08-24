import React, { useRef, useState } from "react";
import { fileToCompressedDataUrl, assetUrl } from "../utils/media";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        type={type}
        className="field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="mt-1 block text-xs text-nevoa">{hint}</span>}
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        className="field resize-y"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="mt-1 block text-xs text-nevoa">{hint}</span>}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        type="number"
        className="field"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className="mt-1 block text-xs text-nevoa">{hint}</span>}
    </label>
  );
}

/**
 * Imagem: aceita upload (comprimido para caber no armazenamento local)
 * ou um caminho manual como /assets/photos/foto.jpg
 */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao processar a imagem.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-3">
        <div className="glass grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl">
          {value ? (
            <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[0.6rem] text-nevoa">sem foto</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost !px-4 !py-1.5 text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "Processando…" : "Enviar foto"}
            </button>
            {value && (
              <button
                type="button"
                className="btn-ghost !px-4 !py-1.5 text-xs"
                onClick={() => onChange("")}
              >
                Remover
              </button>
            )}
          </div>
          <input
            className="field text-xs"
            value={value.startsWith("data:") ? "(foto enviada pelo painel)" : value}
            placeholder="ou caminho: /assets/photos/foto.jpg"
            onChange={(e) => onChange(e.target.value)}
            disabled={value.startsWith("data:")}
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
    </div>
  );
}

/** Lista genérica com adicionar / excluir / reordenar (↑ ↓). */
export function ListEditor<T>({
  items,
  onChange,
  render,
  create,
  addLabel,
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (next: T) => void, index: number) => React.ReactNode;
  create: () => T;
  addLabel: string;
  itemLabel: (item: T, index: number) => string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-pergaminho/90">
              {itemLabel(item, i)}
            </span>
            <span className="flex shrink-0 gap-1">
              <button type="button" aria-label="Mover para cima" className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" aria-label="Mover para baixo" className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button
                type="button"
                aria-label="Excluir"
                className="btn-ghost !border-red-400/40 !px-2.5 !py-1 text-xs !text-red-300"
                onClick={() => {
                  if (window.confirm("Excluir este item?")) {
                    onChange(items.filter((_, k) => k !== i));
                  }
                }}
              >
                ✕
              </button>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {render(item, (next) => onChange(items.map((it, k) => (k === i ? next : it))), i)}
          </div>
        </div>
      ))}
      <button type="button" className="btn-primary self-start !text-xs" onClick={() => onChange([...items, create()])}>
        + {addLabel}
      </button>
    </div>
  );
}

/** Lista simples de strings (frases). */
export function LinesEditor({
  lines,
  onChange,
  addLabel = "Adicionar frase",
}: {
  lines: string[];
  onChange: (lines: string[]) => void;
  addLabel?: string;
}) {
  return (
    <ListEditor
      items={lines}
      onChange={onChange}
      create={() => ""}
      addLabel={addLabel}
      itemLabel={(l, i) => l || `Frase ${i + 1}`}
      render={(line, update) => (
        <textarea
          className="field resize-y"
          rows={2}
          value={line}
          onChange={(e) => update(e.target.value)}
        />
      )}
    />
  );
}

/**
 * Campo para vídeo ou áudio que mora em public/assets/.
 * O botão "Escolher arquivo" não faz upload (vídeo não cabe no
 * armazenamento do navegador) — ele monta o caminho certo e lembra
 * você de copiar o arquivo para a pasta.
 */
export function MediaField({
  label,
  value,
  onChange,
  folder,
  accept,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** "videos" ou "audio" */
  folder: string;
  accept: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState("");

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field flex-1 !w-auto text-xs"
          value={value.startsWith("data:") ? "(arquivo gravado no painel)" : value}
          placeholder={`/assets/${folder}/nome.${folder === "videos" ? "mp4" : "mp3"}`}
          onChange={(e) => onChange(e.target.value)}
          disabled={value.startsWith("data:")}
        />
        <button
          type="button"
          className="btn-ghost !px-4 !py-1.5 text-xs"
          onClick={() => inputRef.current?.click()}
        >
          Escolher arquivo
        </button>
        {value && (
          <button type="button" className="btn-ghost !px-4 !py-1.5 text-xs" onClick={() => onChange("")}>
            Remover
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const safe = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "-");
          onChange(`/assets/${folder}/${safe}`);
          setCopied(safe);
          e.target.value = "";
        }}
      />
      {copied && (
        <span className="mt-2 block rounded-xl bg-[rgba(217,184,124,0.12)] p-2 text-xs leading-relaxed text-ourosuave">
          Agora copie o arquivo <strong>{copied}</strong> para a pasta{" "}
          <code>public/assets/{folder}/</code> do projeto e faça o commit.
        </span>
      )}
      {hint && <span className="mt-1 block text-xs text-nevoa">{hint}</span>}
    </div>
  );
}

/**
 * Gravador de voz: grava direto no painel.
 * Áudios curtos podem ser usados na hora; os longos você baixa e
 * coloca em public/assets/audio/ (fica mais leve e não estoura o
 * armazenamento do navegador).
 */
export function AudioRecorderField({ onUse }: { onUse: (dataUrl: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");
  const [size, setSize] = useState(0);
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const blobRef = useRef<Blob | null>(null);

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        blobRef.current = blob;
        setSize(blob.size);
        setBlobUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      setError("Não consegui acessar o microfone. Verifique a permissão do navegador.");
    }
  };

  const stop = () => {
    recorder.current?.stop();
    setRecording(false);
  };

  const use = () => {
    const blob = blobRef.current;
    if (!blob) return;
    const reader = new FileReader();
    reader.onload = () => onUse(String(reader.result));
    reader.readAsDataURL(blob);
  };

  const tooBig = size > 900_000;

  return (
    <div className="rounded-2xl border border-pergaminho/10 p-3">
      <span className="field-label">Gravar minha voz</span>
      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button type="button" className="btn-ghost !px-4 !py-1.5 text-xs" onClick={() => void start()}>
            ● Gravar
          </button>
        ) : (
          <button type="button" className="btn-primary !px-4 !py-1.5 !text-xs" onClick={stop}>
            ■ Parar
          </button>
        )}
        {blobUrl && (
          <>
            <audio src={blobUrl} controls className="h-8" />
            <a className="btn-ghost !px-4 !py-1.5 text-xs" href={blobUrl} download="minha-voz.webm">
              Baixar
            </a>
            {!tooBig && (
              <button type="button" className="btn-ghost !px-4 !py-1.5 text-xs" onClick={use}>
                Usar este áudio
              </button>
            )}
          </>
        )}
      </div>
      {blobUrl && (
        <span className="mt-2 block text-xs text-nevoa">
          {tooBig
            ? "Áudio longo: baixe o arquivo, coloque em public/assets/audio/ e informe o caminho acima."
            : "Você pode usar direto ou baixar e colocar em public/assets/audio/ (recomendado para o site publicado)."}
        </span>
      )}
      {error && <span className="mt-2 block text-xs text-red-400">{error}</span>}
    </div>
  );
}
