import type { SiteContent } from "../types/content";

/**
 * CONTEÚDO PADRÃO DO SITE
 * ------------------------------------------------------------------
 * Tudo aqui pode (e deve) ser editado — de preferência pelo painel
 * em /#/admin, que salva por cima destes valores.
 *
 * Onde você vir [ADICIONAR ...], é um placeholder esperando o
 * conteúdo real. Nada aqui inventa fatos sobre o relacionamento.
 */
export const defaultContent: SiteContent = {
  version: 1,

  relationship: {
    herName: "Fernanda Wegner",
    yourName: "Henrique",
    nickname: "Fernanda",
    startDate: "2024-01-01", // [ADICIONAR DATA] início do relacionamento (AAAA-MM-DD)
  },

  birthday: {
    age: 0, // [ADICIONAR IDADE] — 0 esconde a idade
    date: "2026-01-01", // [ADICIONAR DATA] aniversário dela
    title: "Feliz aniversário, meu amor.",
    message:
      "[ADICIONAR TEXTO] Escreva aqui a sua mensagem de aniversário. Fale por que hoje é o dia de celebrar a existência dela.",
    photo: "", // [ADICIONAR FOTO] foto principal dela
  },

  aboutHer: {
    intro: [
      "Antes de falar sobre a nossa história...",
      "Eu quero falar sobre você.",
      "Sobre a pessoa incrível que você é.",
    ],
    qualities: [
      {
        title: "[ADICIONAR QUALIDADE]",
        text: "[ADICIONAR TEXTO] Descreva algo que você admira nela.",
      },
      {
        title: "[ADICIONAR QUALIDADE]",
        text: "[ADICIONAR TEXTO] Descreva outra característica dela.",
      },
      {
        title: "[ADICIONAR QUALIDADE]",
        text: "[ADICIONAR TEXTO] Mais uma coisa que só ela tem.",
      },
    ],
  },

  timeline: [
    {
      id: "t1",
      date: "[ADICIONAR DATA]",
      title: "O dia em que nos conhecemos",
      description: "[ADICIONAR TEXTO] Conte como esse dia foi.",
      image: "",
      highlight: true,
    },
    {
      id: "t2",
      date: "[ADICIONAR DATA]",
      title: "Nosso primeiro momento especial",
      description: "[ADICIONAR TEXTO] O que aconteceu e como você se sentiu.",
      image: "",
    },
    {
      id: "t3",
      date: "[ADICIONAR DATA]",
      title: "Primeira foto juntos",
      description: "[ADICIONAR TEXTO] A história por trás da foto.",
      image: "", // [ADICIONAR FOTO]
    },
    {
      id: "t4",
      date: "[ADICIONAR DATA]",
      title: "Um momento inesquecível",
      description: "[ADICIONAR TEXTO] Aquele momento que você nunca esquece.",
      image: "",
    },
    {
      id: "t5",
      date: "Hoje",
      title: "Hoje",
      description:
        "[ADICIONAR TEXTO] Onde a história de vocês está agora — e por que você faria tudo de novo.",
      image: "",
      highlight: true,
    },
  ],

  reasons: [
    { id: "r1", title: "Seu sorriso", text: "[ADICIONAR TEXTO] Por que o sorriso dela é especial para você." },
    { id: "r2", title: "Seu jeito", text: "[ADICIONAR TEXTO] O jeito dela que você ama." },
    { id: "r3", title: "Seu olhar", text: "[ADICIONAR TEXTO] O que você vê quando olha nos olhos dela." },
    { id: "r4", title: "Seu carinho", text: "[ADICIONAR TEXTO] Como o carinho dela te faz sentir." },
    { id: "r5", title: "Sua companhia", text: "[ADICIONAR TEXTO] Por que estar com ela é o seu lugar favorito." },
    { id: "r6", title: "Como você me faz sentir", text: "[ADICIONAR TEXTO] Descreva esse sentimento com suas palavras." },
  ],

  memories: [
    {
      id: "m1",
      image: "", // [ADICIONAR FOTO]
      title: "[ADICIONAR TÍTULO]",
      date: "[ADICIONAR DATA]",
      message:
        "Essa foto parece simples, mas eu lembro exatamente de como me senti naquele momento. [ADICIONAR TEXTO]",
    },
    {
      id: "m2",
      image: "", // [ADICIONAR FOTO]
      title: "[ADICIONAR TÍTULO]",
      date: "[ADICIONAR DATA]",
      message: "[ADICIONAR TEXTO] O que essa memória significa para você.",
    },
  ],

  heavyDays: {
    title: "Quando tudo parecer pesado...",
    lines: [
      "Respira.",
      "Você não precisa resolver tudo hoje.",
      "Você não precisa ser forte o tempo inteiro.",
      "Pode descansar.",
      "Pode chorar.",
      "Pode ter dias ruins.",
      "Mas nunca esquece que você não está sozinha.",
      "Eu estou aqui.",
      "Eu vou continuar segurando sua mão.",
    ],
  },

  goodAndBadDays: {
    title: "Nos dias bons e nos dias ruins",
    lines: [
      "Eu não quero estar ao seu lado somente quando você estiver sorrindo.",
      "Quero estar quando você estiver feliz.",
      "Quando estiver cansada.",
      "Quando estiver perdida.",
      "Quando estiver com medo.",
      "Quando não souber o que fazer.",
      "Quero estar nos dias bons.",
      "E também nos dias difíceis.",
      "Porque amar você não é amar somente as suas melhores fases.",
      "É escolher você em todas elas.",
    ],
  },

  youCan: {
    title: "Você consegue",
    lines: [
      "Talvez você não consiga enxergar agora.",
      "Mas eu consigo.",
      "Eu vejo a mulher incrível que você é.",
      "Vejo o quanto você já enfrentou.",
      "Vejo o quanto você continua tentando.",
      "E tenho muito orgulho de você.",
    ],
  },

  openWhenNeeded: {
    title: "Abra quando precisar de mim",
    lines: [
      "Imagine que eu estou aí agora.",
      "Segurando sua mão.",
      "Te abraçando.",
      "E dizendo que você não precisa passar por tudo isso sozinha.",
      "Eu te amo.",
    ],
  },

  loveLetter: {
    title: "Tem uma coisa que eu preciso te dizer...",
    paragraphs: [
      "[ADICIONAR TEXTO] Escreva aqui a sua carta de amor.",
      "[ADICIONAR TEXTO] Ela pode ter quantos parágrafos você quiser — cada parágrafo é um item separado no painel.",
      "[ADICIONAR TEXTO] Escreva do seu jeito. É isso que vai fazer ela sentir que é sua.",
    ],
    signature: "Com todo o meu amor, Henrique.",
  },

  surpriseMessages: [
    "Só passando para lembrar que eu te amo.",
    "Você é uma das partes mais bonitas da minha vida.",
    "Tenho orgulho de você.",
    "Eu acredito em você.",
    "Estou aqui.",
    "Vai um passo de cada vez.",
  ],

  future: {
    title: "E isso é só o começo.",
    lines: [
      "Mais viagens.",
      "Mais domingos juntos.",
      "Mais fotos.",
      "Mais histórias.",
      "Mais momentos que ainda nem existem.",
    ],
    closing: "Mais nós.",
  },

  final: {
    lines: [
      "Fernanda Wegner.",
      "Obrigado por existir na minha vida.",
      "Obrigado por ser você.",
      "E, acima de tudo...",
    ],
    promise:
      "Nos dias em que o mundo parecer leve.\nE nos dias em que ele parecer pesado demais.\nEu estarei aqui.",
    closing: "Enquanto você quiser minha mão, ela será sua.",
  },

  music: {
    src: "", // [ADICIONAR MÚSICA] ex.: /assets/music/music.mp3
    volume: 0.6,
    bySection: {},
  },

  theme: {
    accent: "#D9B87C",
    accentSoft: "#E8D5AE",
    background: "#0A0D18",
    surface: "#1A2138",
    particleIntensity: 0.6,
    glow: true,
  },

  admin: {
    // Senha do painel. Troque no próprio painel depois do primeiro acesso.
    password: "nosso-amor",
  },

  meta: {
    title: "Para Fernanda ❤️",
    description: "Uma coisa que eu fiz para você.",
  },
};
