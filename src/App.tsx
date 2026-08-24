import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ContentProvider, useContent } from "./store/contentStore";
import Starfield from "./components/Starfield";
import MusicPlayer, { type MusicPlayerHandle } from "./components/MusicPlayer";
import SurpriseMessages from "./components/SurpriseMessages";
import ProgressNav from "./components/ProgressNav";
import Opening from "./sections/Opening";
import BirthdaySection from "./sections/BirthdaySection";
import AboutHer from "./sections/AboutHer";
import TimelineSection from "./sections/TimelineSection";
import ReasonsSection from "./sections/ReasonsSection";
import MemoriesSection from "./sections/MemoriesSection";
import VideoSection from "./sections/VideoSection";
import MoodSection from "./sections/MoodSection";
import VoiceSection from "./sections/VoiceSection";
import HoldHandSection from "./sections/HoldHandSection";
import { HeavyDaysSection, GoodAndBadDaysSection, YouCanSection } from "./sections/SupportSections";
import OpenWhenNeeded from "./sections/OpenWhenNeeded";
import LetterSection from "./sections/LetterSection";
import GameSection from "./sections/GameSection";
import { FutureSection, FinalSection } from "./sections/FutureAndFinal";
import AdminApp from "./admin/AdminApp";

/** Todas as seções possíveis, na ordem em que aparecem. */
const ALL_SECTIONS = [
  { id: "aniversario", label: "Feliz aniversário" },
  { id: "voce", label: "Você" },
  { id: "historia", label: "Nossa história" },
  { id: "motivos", label: "Por que eu amo você" },
  { id: "momentos", label: "Momentos" },
  { id: "videos", label: "Vídeos" },
  { id: "como-esta", label: "Como você está" },
  { id: "refugio", label: "Quando pesar" },
  { id: "dias", label: "Dias bons e ruins" },
  { id: "forca", label: "Você consegue" },
  { id: "abraco", label: "Abra quando precisar" },
  { id: "voz", label: "Minha voz" },
  { id: "carta", label: "A carta" },
  { id: "jogo", label: "Uma pergunta" },
  { id: "futuro", label: "O futuro" },
  { id: "mao", label: "Segura aqui" },
  { id: "final", label: "Para sempre" },
];

/** Roteamento minimalista por hash: #/ (experiência) e #/admin (painel). */
function useHashRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

function Experience() {
  const { content } = useContent();
  const [entered, setEntered] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);

  // Música acompanha os momentos da experiência (quando configurada por seção)
  useEffect(() => {
    if (!entered) return;
    const moods: Record<string, "intro" | "memories" | "emotional" | "ending"> = {
      aniversario: "intro",
      voce: "intro",
      historia: "memories",
      motivos: "memories",
      momentos: "memories",
      videos: "memories",
      "como-esta": "emotional",
      refugio: "emotional",
      dias: "emotional",
      forca: "emotional",
      abraco: "emotional",
      voz: "emotional",
      carta: "emotional",
      jogo: "ending",
      futuro: "ending",
      mao: "ending",
      final: "ending",
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const mood = moods[e.target.id];
            if (mood) musicRef.current?.setMood(mood);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entered]);

  // As seções opcionais só entram na navegação quando têm conteúdo
  const hidden = new Set<string>();
  if (!content.videos.enabled || content.videos.items.every((v) => !v.src.trim())) hidden.add("videos");
  if (!content.mood.enabled || content.mood.options.length === 0) hidden.add("como-esta");
  if (!content.voice.enabled || content.voice.items.every((v) => !v.src.trim())) hidden.add("voz");
  if (!content.holdHand.enabled) hidden.add("mao");
  const navSections = ALL_SECTIONS.filter((s) => !hidden.has(s.id));

  return (
    <>
      <Starfield />
      {!entered && (
        <Opening
          onEnter={() => {
            musicRef.current?.start();
            setEntered(true);
            window.scrollTo({ top: 0 });
          }}
        />
      )}
      <MusicPlayer ref={musicRef} visible={entered} />
      <SurpriseMessages active={entered} />
      {entered && (
        <>
          <ProgressNav sections={navSections} />
          <main>
            <BirthdaySection />
            <AboutHer />
            <TimelineSection />
            <ReasonsSection />
            <MemoriesSection />
            <VideoSection />
            <MoodSection />
            <HeavyDaysSection />
            <GoodAndBadDaysSection />
            <YouCanSection />
            <OpenWhenNeeded />
            <VoiceSection />
            <LetterSection />
            <GameSection />
            <FutureSection />
            <HoldHandSection />
            <FinalSection />
          </main>
        </>
      )}
    </>
  );
}

export default function App() {
  const route = useHashRoute();
  const isAdmin = route.startsWith("/admin");

  return (
    <ContentProvider>
      <MotionConfig reducedMotion="user">
        {isAdmin ? (
          <>
            <Starfield />
            <AdminApp />
          </>
        ) : (
          <Experience />
        )}
      </MotionConfig>
    </ContentProvider>
  );
}
