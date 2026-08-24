import { useRef, useState } from "react";
import { useContent, exportContent, importContent, resetContent, loadContent } from "../store/contentStore";
import type { SiteContent } from "../types/content";
import {
  AreaField,
  AudioRecorderField,
  Field,
  ImageField,
  LinesEditor,
  ListEditor,
  MediaField,
  NumberField,
} from "./fields";
import { newId } from "../utils/media";

type Tab =
  | "geral"
  | "abertura"
  | "aniversario"
  | "sobre"
  | "historia"
  | "motivos"
  | "memorias"
  | "videos"
  | "voz"
  | "humor"
  | "carta"
  | "acolhimento"
  | "interacoes"
  | "fecho"
  | "surpresa"
  | "musica"
  | "tema";

const TABS: { id: Tab; label: string }[] = [
  { id: "geral", label: "Geral" },
  { id: "abertura", label: "Abertura" },
  { id: "aniversario", label: "Aniversário" },
  { id: "sobre", label: "Sobre ela" },
  { id: "historia", label: "Nossa história" },
  { id: "motivos", label: "Motivos" },
  { id: "memorias", label: "Memórias" },
  { id: "videos", label: "Vídeos" },
  { id: "voz", label: "Minha voz" },
  { id: "humor", label: "Como você está" },
  { id: "carta", label: "Carta" },
  { id: "acolhimento", label: "Acolhimento" },
  { id: "interacoes", label: "Interações" },
  { id: "fecho", label: "Jogo e final" },
  { id: "surpresa", label: "Mensagens surpresa" },
  { id: "musica", label: "Música" },
  { id: "tema", label: "Tema" },
];

const SESSION_KEY = "para-fernanda:admin";

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  return authed ? <Dashboard onLogout={() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }} /> : <Login onOk={() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthed(true);
  }} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    // A senha vive no conteúdo salvo (padrão: "nosso-amor").
    if (pass === loadContent().admin.password) onOk();
    else setError(true);
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-sm rounded-3xl p-8">
        <h1 className="mb-1 font-display text-2xl italic">
          <span className="font-accent">Painel</span>
        </h1>
        <p className="mb-6 text-xs text-nevoa">Área do Henrique. A Fernanda não deveria estar vendo isso. 👀</p>
        <label className="field-label" htmlFor="admin-pass">Senha</label>
        <input
          id="admin-pass"
          type="password"
          className="field"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        {error && <p className="mt-2 text-xs text-red-400">Senha incorreta.</p>}
        <button type="button" className="btn-primary mt-5 w-full justify-center" onClick={submit}>
          Entrar
        </button>
        <a href="#/" className="mt-4 block text-center text-xs text-nevoa hover:text-pergaminho">
          ← voltar ao site
        </a>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, update, replace, saveOk } = useContent();
  const [tab, setTab] = useState<Tab>("geral");
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (fn: (c: SiteContent) => void) =>
    update((draft) => {
      fn(draft);
      return draft;
    });

  const doExport = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "para-fernanda-conteudo.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const doImport = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (importContent(String(reader.result))) replace(loadContent());
      else window.alert("Arquivo inválido.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl italic">
            <span className="font-accent">Painel do site</span>
          </h1>
          <p className="text-xs text-nevoa">
            Tudo salva automaticamente.{" "}
            {saveOk ? (
              <span className="text-emerald-400">✓ salvo</span>
            ) : (
              <span className="text-red-400">
                ⚠ não foi possível salvar — espaço cheio; use fotos menores ou caminhos em /assets/photos
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost text-xs" onClick={() => setPreview((v) => !v)}>
            {preview ? "Fechar preview" : "Preview instantâneo"}
          </button>
          <a className="btn-ghost text-xs" href="#/" target="_blank" rel="noreferrer">
            Abrir o site ↗
          </a>
          <button type="button" className="btn-ghost text-xs" onClick={doExport}>
            Exportar
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={() => fileRef.current?.click()}>
            Importar
          </button>
          <button
            type="button"
            className="btn-ghost !border-red-400/40 text-xs !text-red-300"
            onClick={() => {
              if (window.confirm("Restaurar TODO o conteúdo para o padrão? Isso apaga suas edições.")) {
                resetContent();
                replace(loadContent());
              }
            }}
          >
            Restaurar padrão
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={onLogout}>
            Sair
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-nevoa">
          Para publicar suas edições no site no ar: clique em <strong>Exportar</strong> e
          substitua o arquivo <code>public/content.json</code> do repositório pelo JSON baixado.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => doImport(e.target.files?.[0])}
        />
      </header>

      <div className={`grid gap-6 ${preview ? "lg:grid-cols-2" : ""}`}>
        <div>
          <nav className="mb-6 flex flex-wrap gap-2" aria-label="Categorias do painel">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="rounded-full px-4 py-1.5 text-xs transition-colors"
                style={{
                  background: tab === t.id ? "var(--accent)" : "rgba(240,234,224,0.06)",
                  color: tab === t.id ? "#171207" : "#F0EAE0",
                }}
                aria-current={tab === t.id ? "page" : undefined}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-5 pb-24">
            {tab === "geral" && <GeneralTab content={content} set={set} />}
            {tab === "abertura" && <OpeningTab content={content} set={set} />}
            {tab === "aniversario" && <BirthdayTab content={content} set={set} />}
            {tab === "sobre" && <AboutTab content={content} set={set} />}
            {tab === "historia" && <TimelineTab content={content} set={set} />}
            {tab === "motivos" && <ReasonsTab content={content} set={set} />}
            {tab === "memorias" && <MemoriesTab content={content} set={set} />}
            {tab === "videos" && <VideosTab content={content} set={set} />}
            {tab === "voz" && <VoiceTab content={content} set={set} />}
            {tab === "humor" && <MoodTab content={content} set={set} />}
            {tab === "carta" && <LetterTab content={content} set={set} />}
            {tab === "acolhimento" && <SupportTab content={content} set={set} />}
            {tab === "interacoes" && <InteractionsTab content={content} set={set} />}
            {tab === "fecho" && <EndingTab content={content} set={set} />}
            {tab === "surpresa" && (
              <Card title="Mensagens surpresa" hint="Aparecem de vez em quando enquanto ela navega.">
                <LinesEditor
                  lines={content.surpriseMessages}
                  onChange={(v) => set((c) => void (c.surpriseMessages = v))}
                  addLabel="Adicionar mensagem"
                />
              </Card>
            )}
            {tab === "musica" && <MusicTab content={content} set={set} />}
            {tab === "tema" && <ThemeTab content={content} set={set} />}
          </div>
        </div>

        {preview && (
          <div className="sticky top-6 hidden h-[85vh] overflow-hidden rounded-3xl border border-pergaminho/10 lg:block">
            <iframe
              title="Preview do site"
              src="#/"
              className="h-full w-full"
              style={{ background: "var(--bg)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <h2 className="mb-1 font-display text-xl italic">
        <span className="font-accent">{title}</span>
      </h2>
      {hint && <p className="mb-4 text-xs text-nevoa">{hint}</p>}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

type TabProps = { content: SiteContent; set: (fn: (c: SiteContent) => void) => void };

function GeneralTab({ content, set }: TabProps) {
  return (
    <>
      <Card title="Informações gerais">
        <Field label="Nome dela" value={content.relationship.herName} onChange={(v) => set((c) => void (c.relationship.herName = v))} />
        <Field label="Apelido" value={content.relationship.nickname} onChange={(v) => set((c) => void (c.relationship.nickname = v))} />
        <Field label="Seu nome" value={content.relationship.yourName} onChange={(v) => set((c) => void (c.relationship.yourName = v))} />
        <Field
          label="Início do relacionamento"
          type="date"
          value={content.relationship.startDate.slice(0, 10)}
          onChange={(v) => set((c) => void (c.relationship.startDate = v))}
          hint="Usada no contador ao final do site."
        />
      </Card>
      <Card title="Metadados do site">
        <Field label="Título da aba" value={content.meta.title} onChange={(v) => set((c) => void (c.meta.title = v))} />
        <Field label="Descrição" value={content.meta.description} onChange={(v) => set((c) => void (c.meta.description = v))} />
      </Card>
      <Card title="Segurança do painel">
        <Field
          label="Senha do painel"
          value={content.admin.password}
          onChange={(v) => set((c) => void (c.admin.password = v))}
          hint="Padrão: nosso-amor. Troque por uma que só você saiba."
        />
      </Card>
    </>
  );
}

function BirthdayTab({ content, set }: TabProps) {
  return (
    <Card title="Aniversário">
      <Field label="Título" value={content.birthday.title} onChange={(v) => set((c) => void (c.birthday.title = v))} />
      <Field label="Data do aniversário" type="date" value={content.birthday.date} onChange={(v) => set((c) => void (c.birthday.date = v))} />
      <NumberField label="Idade que ela completa" value={content.birthday.age} min={0} onChange={(v) => set((c) => void (c.birthday.age = v))} hint="Deixe 0 para não mostrar a idade." />
      <ImageField label="Foto principal" value={content.birthday.photo} onChange={(v) => set((c) => void (c.birthday.photo = v))} />
      <AreaField label="Mensagem de aniversário" rows={6} value={content.birthday.message} onChange={(v) => set((c) => void (c.birthday.message = v))} />
    </Card>
  );
}

function AboutTab({ content, set }: TabProps) {
  return (
    <>
      <Card title="Frases de introdução" hint="Aparecem uma a uma antes das qualidades.">
        <LinesEditor lines={content.aboutHer.intro} onChange={(v) => set((c) => void (c.aboutHer.intro = v))} />
      </Card>
      <Card title="Qualidades dela">
        <ListEditor
          items={content.aboutHer.qualities}
          onChange={(v) => set((c) => void (c.aboutHer.qualities = v))}
          create={() => ({ title: "", text: "" })}
          addLabel="Adicionar qualidade"
          itemLabel={(q, i) => q.title || `Qualidade ${i + 1}`}
          render={(q, updateItem) => (
            <>
              <Field label="Título" value={q.title} onChange={(v) => updateItem({ ...q, title: v })} />
              <AreaField label="Texto" rows={3} value={q.text} onChange={(v) => updateItem({ ...q, text: v })} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function TimelineTab({ content, set }: TabProps) {
  return (
    <Card title="Nossa história" hint="Adicione, edite, reordene e exclua momentos.">
      <ListEditor
        items={content.timeline}
        onChange={(v) => set((c) => void (c.timeline = v))}
        create={() => ({ id: newId("t"), date: "", title: "", description: "", image: "" })}
        addLabel="Adicionar evento"
        itemLabel={(e, i) => e.title || `Evento ${i + 1}`}
        render={(e, updateItem) => (
          <>
            <Field label="Data" value={e.date} onChange={(v) => updateItem({ ...e, date: v })} hint="Texto livre: 14 de junho de 2024, ou só o ano." />
            <Field label="Título" value={e.title} onChange={(v) => updateItem({ ...e, title: v })} />
            <AreaField label="Descrição" rows={3} value={e.description} onChange={(v) => updateItem({ ...e, description: v })} />
            <ImageField label="Foto" value={e.image ?? ""} onChange={(v) => updateItem({ ...e, image: v })} />
            <Field label="Vídeo (opcional)" value={e.video ?? ""} onChange={(v) => updateItem({ ...e, video: v })} hint="Caminho: /assets/videos/nome.mp4" />
            <label className="flex items-center gap-2 text-xs text-pergaminho/80">
              <input
                type="checkbox"
                checked={Boolean(e.highlight)}
                onChange={(ev) => updateItem({ ...e, highlight: ev.target.checked })}
                className="accent-[var(--accent)]"
              />
              Destaque especial (ponto dourado na linha)
            </label>
          </>
        )}
      />
    </Card>
  );
}

function ReasonsTab({ content, set }: TabProps) {
  return (
    <Card title="Por que eu amo você" hint="Cada motivo vira uma estrela clicável.">
      <ListEditor
        items={content.reasons}
        onChange={(v) => set((c) => void (c.reasons = v))}
        create={() => ({ id: newId("r"), title: "", text: "", image: "" })}
        addLabel="Adicionar motivo"
        itemLabel={(r, i) => r.title || `Motivo ${i + 1}`}
        render={(r, updateItem) => (
          <>
            <Field label="Título" value={r.title} onChange={(v) => updateItem({ ...r, title: v })} />
            <AreaField label="Texto" rows={3} value={r.text} onChange={(v) => updateItem({ ...r, text: v })} />
            <ImageField label="Foto (opcional)" value={r.image ?? ""} onChange={(v) => updateItem({ ...r, image: v })} />
          </>
        )}
      />
    </Card>
  );
}

function MemoriesTab({ content, set }: TabProps) {
  return (
    <Card title="Momentos que eu guardo" hint="Cada memória abre um cartão com foto, data e mensagem.">
      <ListEditor
        items={content.memories}
        onChange={(v) => set((c) => void (c.memories = v))}
        create={() => ({ id: newId("m"), image: "", title: "", date: "", message: "" })}
        addLabel="Adicionar memória"
        itemLabel={(m, i) => m.title || `Memória ${i + 1}`}
        render={(m, updateItem) => (
          <>
            <ImageField label="Foto" value={m.image} onChange={(v) => updateItem({ ...m, image: v })} />
            <Field label="Título" value={m.title} onChange={(v) => updateItem({ ...m, title: v })} />
            <Field label="Data" value={m.date} onChange={(v) => updateItem({ ...m, date: v })} />
            <AreaField label="Mensagem" rows={3} value={m.message} onChange={(v) => updateItem({ ...m, message: v })} />
          </>
        )}
      />
    </Card>
  );
}

function LetterTab({ content, set }: TabProps) {
  return (
    <Card title="Carta de amor" hint="Cada parágrafo é um item — eles aparecem um a um quando a carta abre.">
      <Field label="Título da seção" value={content.loveLetter.title} onChange={(v) => set((c) => void (c.loveLetter.title = v))} />
      <LinesEditor
        lines={content.loveLetter.paragraphs}
        onChange={(v) => set((c) => void (c.loveLetter.paragraphs = v))}
        addLabel="Adicionar parágrafo"
      />
      <Field label="Assinatura" value={content.loveLetter.signature} onChange={(v) => set((c) => void (c.loveLetter.signature = v))} />
    </Card>
  );
}

function SupportTab({ content, set }: TabProps) {
  const sections = [
    { key: "heavyDays" as const, name: "Quando tudo parecer pesado" },
    { key: "goodAndBadDays" as const, name: "Nos dias bons e nos dias ruins" },
    { key: "youCan" as const, name: "Você consegue" },
    { key: "openWhenNeeded" as const, name: "Abra quando precisar de mim" },
  ];
  return (
    <>
      {sections.map((s) => (
        <Card key={s.key} title={s.name}>
          <Field
            label="Título"
            value={content[s.key].title}
            onChange={(v) => set((c) => void (c[s.key].title = v))}
          />
          <LinesEditor
            lines={content[s.key].lines}
            onChange={(v) => set((c) => void (c[s.key].lines = v))}
          />
        </Card>
      ))}
    </>
  );
}

function MusicTab({ content, set }: TabProps) {
  return (
    <Card
      title="Música"
      hint="Coloque o arquivo em public/assets/music/ e informe o caminho. A música começa quando ela clica em 'Entrar no nosso mundo'."
    >
      <Field
        label="Música principal"
        value={content.music.src}
        onChange={(v) => set((c) => void (c.music.src = v))}
        placeholder="/assets/music/music.mp3"
      />
      <NumberField
        label="Volume inicial (0 a 1)"
        value={content.music.volume}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => set((c) => void (c.music.volume = Math.min(1, Math.max(0, v))))}
      />
      {(["intro", "memories", "emotional", "ending"] as const).map((k) => (
        <Field
          key={k}
          label={`Música — ${
            { intro: "início", memories: "memórias", emotional: "momento emocional", ending: "final" }[k]
          } (opcional)`}
          value={content.music.bySection[k] ?? ""}
          onChange={(v) => set((c) => void (c.music.bySection[k] = v || undefined))}
          placeholder="vazio = usa a principal"
        />
      ))}
    </Card>
  );
}

function ThemeTab({ content, set }: TabProps) {
  const color = (label: string, key: "accent" | "accentSoft" | "background" | "surface") => (
    <label className="flex items-center justify-between gap-3">
      <span className="field-label !m-0">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={content.theme[key]}
          onChange={(e) => set((c) => void (c.theme[key] = e.target.value))}
          className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent"
          aria-label={label}
        />
        <code className="text-xs text-nevoa">{content.theme[key]}</code>
      </span>
    </label>
  );
  return (
    <Card title="Tema" hint="Poucas opções, mas todas mudam o site de verdade.">
      {color("Cor de destaque", "accent")}
      {color("Destaque suave", "accentSoft")}
      {color("Fundo", "background")}
      {color("Superfícies", "surface")}
      <NumberField
        label="Intensidade das estrelas (0 a 1)"
        value={content.theme.particleIntensity}
        min={0}
        max={1}
        step={0.1}
        onChange={(v) => set((c) => void (c.theme.particleIntensity = Math.min(1, Math.max(0, v))))}
      />
      <label className="flex items-center gap-2 text-xs text-pergaminho/80">
        <input
          type="checkbox"
          checked={content.theme.glow}
          onChange={(e) => set((c) => void (c.theme.glow = e.target.checked))}
          className="accent-[var(--accent)]"
        />
        Brilho nos textos de destaque
      </label>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Abas novas                                                         */
/* ------------------------------------------------------------------ */

function Toggle({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
      />
      <span>
        <span className="block text-sm text-pergaminho/90">{label}</span>
        {hint && <span className="block text-xs text-nevoa">{hint}</span>}
      </span>
    </label>
  );
}

function OpeningTab({ content, set }: TabProps) {
  const o = content.opening;
  return (
    <>
      <Card
        title="Abertura"
        hint="A primeira tela. Você pode usar {nome}, {apelido} e {meunome} — o site troca pelos nomes configurados na aba Geral."
      >
        <Field label="Linha pequena no topo" value={o.overline} onChange={(v) => set((c) => void (c.opening.overline = v))} />
        <div>
          <span className="field-label">Frases (aparecem uma a uma)</span>
          <LinesEditor lines={o.lines} onChange={(v) => set((c) => void (c.opening.lines = v))} />
        </div>
        <Field label="Frase final em destaque" value={o.highlight} onChange={(v) => set((c) => void (c.opening.highlight = v))} />
        <Field label="Texto do botão" value={o.button} onChange={(v) => set((c) => void (c.opening.button = v))} />
      </Card>
    </>
  );
}

function VideosTab({ content, set }: TabProps) {
  const v = content.videos;
  return (
    <Card
      title="Vídeos"
      hint="Coloque os arquivos .mp4 em public/assets/videos/ e informe o caminho. A seção some sozinha se não houver nenhum vídeo."
    >
      <Toggle
        label="Mostrar a seção de vídeos"
        value={v.enabled}
        onChange={(b) => set((c) => void (c.videos.enabled = b))}
      />
      <Field label="Título da seção" value={v.title} onChange={(x) => set((c) => void (c.videos.title = x))} />
      <AreaField label="Frase de introdução" rows={2} value={v.intro} onChange={(x) => set((c) => void (c.videos.intro = x))} />
      <ListEditor
        items={v.items}
        onChange={(items) => set((c) => void (c.videos.items = items))}
        create={() => ({ id: newId("v"), title: "", date: "", message: "", src: "", poster: "" })}
        addLabel="Adicionar vídeo"
        itemLabel={(i, k) => i.title || `Vídeo ${k + 1}`}
        render={(item, update) => (
          <>
            <Field label="Título" value={item.title} onChange={(x) => update({ ...item, title: x })} />
            <Field label="Data (opcional)" value={item.date} onChange={(x) => update({ ...item, date: x })} />
            <MediaField
              label="Arquivo do vídeo"
              folder="videos"
              accept="video/*"
              value={item.src}
              onChange={(x) => update({ ...item, src: x })}
              hint="Também aceita uma URL direta de .mp4."
            />
            <ImageField label="Capa (opcional)" value={item.poster ?? ""} onChange={(x) => update({ ...item, poster: x })} />
            <AreaField label="Mensagem" value={item.message} onChange={(x) => update({ ...item, message: x })} />
          </>
        )}
      />
    </Card>
  );
}

function VoiceTab({ content, set }: TabProps) {
  const v = content.voice;
  return (
    <Card
      title="Minha voz"
      hint="Mensagens de áudio. Grave aqui mesmo ou use arquivos em public/assets/audio/."
    >
      <Toggle
        label="Mostrar a seção de áudios"
        value={v.enabled}
        onChange={(b) => set((c) => void (c.voice.enabled = b))}
      />
      <Field label="Título da seção" value={v.title} onChange={(x) => set((c) => void (c.voice.title = x))} />
      <AreaField label="Frase de introdução" rows={2} value={v.intro} onChange={(x) => set((c) => void (c.voice.intro = x))} />
      <ListEditor
        items={v.items}
        onChange={(items) => set((c) => void (c.voice.items = items))}
        create={() => ({ id: newId("a"), title: "", description: "", src: "" })}
        addLabel="Adicionar áudio"
        itemLabel={(i, k) => i.title || `Áudio ${k + 1}`}
        render={(item, update) => (
          <>
            <Field label="Título" value={item.title} onChange={(x) => update({ ...item, title: x })} />
            <AreaField
              label="Quando ouvir"
              rows={2}
              value={item.description}
              onChange={(x) => update({ ...item, description: x })}
            />
            <MediaField
              label="Arquivo de áudio"
              folder="audio"
              accept="audio/*"
              value={item.src}
              onChange={(x) => update({ ...item, src: x })}
            />
            <AudioRecorderField onUse={(dataUrl) => update({ ...item, src: dataUrl })} />
          </>
        )}
      />
    </Card>
  );
}

function MoodTab({ content, set }: TabProps) {
  const m = content.mood;
  return (
    <Card
      title="Como você está agora?"
      hint="Ela escolhe como está se sentindo e recebe a mensagem que você escreveu para aquele estado. É a parte que ela mais vai reabrir nos dias difíceis."
    >
      <Toggle label="Mostrar esta seção" value={m.enabled} onChange={(b) => set((c) => void (c.mood.enabled = b))} />
      <Field label="Título" value={m.title} onChange={(x) => set((c) => void (c.mood.title = x))} />
      <AreaField label="Convite (texto menor abaixo do título)" rows={2} value={m.question} onChange={(x) => set((c) => void (c.mood.question = x))} />
      <ListEditor
        items={m.options}
        onChange={(items) => set((c) => void (c.mood.options = items))}
        create={() => ({ id: newId("mo"), label: "", message: "", closing: "" })}
        addLabel="Adicionar estado"
        itemLabel={(i, k) => i.label || `Estado ${k + 1}`}
        render={(item, update) => (
          <>
            <Field label="Como ela se sente (texto do botão)" value={item.label} onChange={(x) => update({ ...item, label: x })} />
            <AreaField
              label="Mensagem"
              rows={5}
              value={item.message}
              onChange={(x) => update({ ...item, message: x })}
              hint="Escreva como se estivesse falando com ela naquele momento."
            />
            <Field label="Frase de fecho (opcional)" value={item.closing ?? ""} onChange={(x) => update({ ...item, closing: x })} />
          </>
        )}
      />
      <Field label="Frase final da seção" value={m.footer} onChange={(x) => set((c) => void (c.mood.footer = x))} />
    </Card>
  );
}

function InteractionsTab({ content, set }: TabProps) {
  const b = content.breathing;
  const h = content.holdHand;
  const w = content.wish;
  return (
    <>
      <Card title="Respira comigo" hint="Círculo de respiração guiada dentro da seção 'Quando tudo parecer pesado'.">
        <Toggle label="Ativar" value={b.enabled} onChange={(x) => set((c) => void (c.breathing.enabled = x))} />
        <Field label="Texto do botão" value={b.label} onChange={(x) => set((c) => void (c.breathing.label = x))} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Palavra ao inspirar" value={b.inhale} onChange={(x) => set((c) => void (c.breathing.inhale = x))} />
          <NumberField label="Segundos" min={1} max={12} value={b.inhaleSeconds} onChange={(x) => set((c) => void (c.breathing.inhaleSeconds = x))} />
          <Field label="Palavra ao segurar" value={b.hold} onChange={(x) => set((c) => void (c.breathing.hold = x))} />
          <NumberField label="Segundos" min={0} max={12} value={b.holdSeconds} onChange={(x) => set((c) => void (c.breathing.holdSeconds = x))} />
          <Field label="Palavra ao soltar" value={b.exhale} onChange={(x) => set((c) => void (c.breathing.exhale = x))} />
          <NumberField label="Segundos" min={1} max={14} value={b.exhaleSeconds} onChange={(x) => set((c) => void (c.breathing.exhaleSeconds = x))} />
        </div>
        <NumberField label="Quantos ciclos" min={1} max={12} value={b.cycles} onChange={(x) => set((c) => void (c.breathing.cycles = x))} />
        <Field label="Mensagem ao terminar" value={b.endMessage} onChange={(x) => set((c) => void (c.breathing.endMessage = x))} />
      </Card>

      <Card title="Segura aqui" hint="Ela pressiona e segura na tela; a luz cresce e a sua mensagem aparece.">
        <Toggle label="Ativar" value={h.enabled} onChange={(x) => set((c) => void (c.holdHand.enabled = x))} />
        <Field label="Título da seção" value={h.title} onChange={(x) => set((c) => void (c.holdHand.title = x))} />
        <Field label="Texto antes de segurar" value={h.prompt} onChange={(x) => set((c) => void (c.holdHand.prompt = x))} />
        <Field label="Texto enquanto segura" value={h.holding} onChange={(x) => set((c) => void (c.holdHand.holding = x))} />
        <NumberField label="Segundos para completar" min={2} max={15} value={h.seconds} onChange={(x) => set((c) => void (c.holdHand.seconds = x))} />
        <AreaField label="Mensagem revelada" rows={4} value={h.message} onChange={(x) => set((c) => void (c.holdHand.message = x))} />
      </Card>

      <Card title="Estrela dos desejos" hint="No finalzinho: ela toca, uma estrela cadente atravessa o céu e sua mensagem aparece.">
        <Toggle label="Ativar" value={w.enabled} onChange={(x) => set((c) => void (c.wish.enabled = x))} />
        <Field label="Convite" value={w.prompt} onChange={(x) => set((c) => void (c.wish.prompt = x))} />
        <AreaField label="Mensagem depois do pedido" rows={3} value={w.message} onChange={(x) => set((c) => void (c.wish.message = x))} />
      </Card>
    </>
  );
}

function EndingTab({ content, set }: TabProps) {
  const g = content.game;
  const f = content.final;
  const fu = content.future;
  return (
    <>
      <Card title="A brincadeira" hint="Qualquer resposta leva ao ∞ — é essa a graça.">
        <Field label="Pergunta" value={g.question} onChange={(x) => set((c) => void (c.game.question = x))} />
        <div>
          <span className="field-label">Opções de resposta</span>
          <LinesEditor lines={g.options} onChange={(x) => set((c) => void (c.game.options = x))} addLabel="Adicionar opção" />
        </div>
        <Field label="Resposta imediata" value={g.wrong} onChange={(x) => set((c) => void (c.game.wrong = x))} />
        <Field label="Explicação" value={g.explain} onChange={(x) => set((c) => void (c.game.explain = x))} />
        <Field label="Texto de 'tentar de novo'" value={g.retry} onChange={(x) => set((c) => void (c.game.retry = x))} />
      </Card>

      <Card title="O futuro">
        <Field label="Título" value={fu.title} onChange={(x) => set((c) => void (c.future.title = x))} />
        <LinesEditor lines={fu.lines} onChange={(x) => set((c) => void (c.future.lines = x))} />
        <Field label="Frase final" value={fu.closing} onChange={(x) => set((c) => void (c.future.closing = x))} />
      </Card>

      <Card title="Encerramento">
        <div>
          <span className="field-label">Frases finais (uma a uma)</span>
          <LinesEditor lines={f.lines} onChange={(x) => set((c) => void (c.final.lines = x))} />
        </div>
        <Field label="Frase em destaque" value={f.love} onChange={(x) => set((c) => void (c.final.love = x))} />
        <AreaField
          label="Promessa"
          rows={3}
          value={f.promise}
          onChange={(x) => set((c) => void (c.final.promise = x))}
          hint="Cada linha aparece separadamente."
        />
        <Field label="Frase de fecho" value={f.closing} onChange={(x) => set((c) => void (c.final.closing = x))} />
        <Field label="Última linha" value={f.birthdayLine} onChange={(x) => set((c) => void (c.final.birthdayLine = x))} />
        <Field label="Rótulo do contador" value={f.counterLabel} onChange={(x) => set((c) => void (c.final.counterLabel = x))} />
      </Card>
    </>
  );
}
