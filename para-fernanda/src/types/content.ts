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
  promise: string;
  closing: string;
}

export interface SiteContent {
  version: 1;
  relationship: Relationship;
  birthday: Birthday;
  aboutHer: AboutHer;
  timeline: TimelineEvent[];
  reasons: Reason[];
  memories: Memory[];
  heavyDays: SupportSection;
  goodAndBadDays: SupportSection;
  youCan: SupportSection;
  openWhenNeeded: SupportSection;
  loveLetter: LoveLetter;
  surpriseMessages: string[];
  future: { title: string; lines: string[]; closing: string };
  final: FinalSection;
  music: MusicSettings;
  theme: ThemeSettings;
  admin: { password: string };
  meta: { title: string; description: string };
}
