/**
 * Tipos centrais de conteúdo.
 * TODO o texto pessoal do site vive dentro de `SiteContent`.
 * Os componentes apenas consomem esses dados — nunca contêm texto pessoal fixo.
 */

export interface Relationship {
  herName: string;
  yourName: string;
  nickname: string;
  /** Formato AAAA-MM-DD (ou AAAA-MM-DDTHH:mm para contar horas com precisão) */
  startDate: string;
}

export interface Birthday {
  /** 0 = ainda não configurada (o site esconde a idade nesse caso) */
  age: number;
  /** Formato AAAA-MM-DD */
  date: string;
  title: string;
  message: string;
  /** Caminho em /assets/photos/... ou imagem enviada pelo painel (data URL) */
  photo: string;
}

export interface AboutHer {
  intro: string[];
  qualities: { title: string; text: string }[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  highlight?: boolean;
}

export interface Reason {
  id: string;
  title: string;
  text: string;
  image?: string;
}

export interface Memory {
  id: string;
  image: string;
  title: string;
  date: string;
  message: string;
}

export interface SupportSection {
  title: string;
  /** Frases mostradas uma a uma, com pausas */
  lines: string[];
}

export interface LoveLetter {
  title: string;
  /** Parágrafos da carta */
  paragraphs: string[];
  signature: string;
}

export interface MusicSettings {
  /** Caminho do arquivo principal, ex.: /assets/music/music.mp3 */
  src: string;
  volume: number; // 0 a 1
  /** Músicas opcionais por momento (vazio = usa a principal) */
  bySection: {
    intro?: string;
    memories?: string;
    emotional?: string;
    ending?: string;
  };
}

export interface ThemeSettings {
  accent: string;
  accentSoft: string;
  background: string;
  surface: string;
  /** 0 a 1 — densidade das estrelas/partículas */
  particleIntensity: number;
  glow: boolean;
}

export interface FinalSection {
  lines: string[];
  /** Frase grande em destaque (ex.: "Eu te amo.") */
  love: string;
  promise: string;
  closing: string;
  /** Última linha, depois do fecho */
  birthdayLine: string;
  /** Rótulo acima do contador */
  counterLabel: string;
}


/* ---------- Abertura e brincadeira (agora 100% editáveis) ---------- */

export interface OpeningContent {
  /** Linha pequena no topo, antes das frases */
  overline: string;
  /** Frases que aparecem uma a uma */
  lines: string[];
  /** Frase final destacada */
  highlight: string;
  /** Texto do botão de entrada */
  button: string;
}

export interface GameContent {
  question: string;
  options: string[];
  wrong: string;
  explain: string;
  retry: string;
}

/* ---------- Vídeos ---------- */

export interface VideoItem {
  id: string;
  title: string;
  date: string;
  message: string;
  /** Caminho em /assets/videos/nome.mp4 ou URL direta de um .mp4 */
  src: string;
  /** Imagem de capa (opcional) */
  poster?: string;
}

export interface VideoGallery {
  enabled: boolean;
  title: string;
  intro: string;
  items: VideoItem[];
}

/* ---------- Áudios: a sua voz ---------- */

export interface VoiceNote {
  id: string;
  title: string;
  description: string;
  /** Caminho em /assets/audio/nome.mp3 ou áudio gravado no painel */
  src: string;
}

export interface VoiceContent {
  enabled: boolean;
  title: string;
  intro: string;
  items: VoiceNote[];
}

/* ---------- "Como você está agora?" ---------- */

export interface MoodOption {
  id: string;
  /** Ex.: "Cansada", "Triste", "Ansiosa", "Bem" */
  label: string;
  /** O que ela lê ao escolher esse estado */
  message: string;
  /** Frase curta de fecho (opcional) */
  closing?: string;
}

export interface MoodContent {
  enabled: boolean;
  title: string;
  question: string;
  options: MoodOption[];
  footer: string;
}

/* ---------- Respirar junto ---------- */

export interface BreathingContent {
  enabled: boolean;
  label: string;
  inhale: string;
  hold: string;
  exhale: string;
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  endMessage: string;
}

/* ---------- Segurar a mão (pressione e segure) ---------- */

export interface HoldHandContent {
  enabled: boolean;
  title: string;
  prompt: string;
  holding: string;
  message: string;
  seconds: number;
}

/* ---------- Estrela dos desejos (no final) ---------- */

export interface WishContent {
  enabled: boolean;
  prompt: string;
  message: string;
}

export interface SiteContent {
  version: 1;
  relationship: Relationship;
  opening: OpeningContent;
  birthday: Birthday;
  aboutHer: AboutHer;
  timeline: TimelineEvent[];
  reasons: Reason[];
  memories: Memory[];
  videos: VideoGallery;
  mood: MoodContent;
  heavyDays: SupportSection;
  breathing: BreathingContent;
  goodAndBadDays: SupportSection;
  youCan: SupportSection;
  openWhenNeeded: SupportSection;
  voice: VoiceContent;
  loveLetter: LoveLetter;
  game: GameContent;
  holdHand: HoldHandContent;
  wish: WishContent;
  surpriseMessages: string[];
  future: { title: string; lines: string[]; closing: string };
  final: FinalSection;
  music: MusicSettings;
  theme: ThemeSettings;
  admin: { password: string };
  meta: { title: string; description: string };
}
