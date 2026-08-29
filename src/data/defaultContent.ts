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

  opening: {
    overline: "{apelido}, eu fiz uma coisa para você",
    lines: [
      "Hoje não é um dia qualquer...",
      "Hoje é o dia de celebrar você.",
      "{nome}.",
    ],
    highlight: "Feliz aniversário.",
    button: "Entrar no nosso mundo",
  },

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

  videos: {
    enabled: true,
    title: "Coisas que eu quis te mostrar",
    intro: "[ADICIONAR TEXTO] Uma frase curta para apresentar os vídeos.",
    items: [
      {
        id: "v1",
        title: "[ADICIONAR TÍTULO]",
        date: "[ADICIONAR DATA]",
        message: "[ADICIONAR TEXTO] O que você quer que ela sinta ao ver esse vídeo.",
        src: "", // ex.: /assets/videos/nosso-video.mp4
        poster: "",
      },
    ],
  },

  mood: {
    enabled: true,
    title: "Como você está agora?",
    question: "Não precisa fingir aqui. Escolhe o que estiver mais perto da verdade.",
    options: [
      {
        id: "mo1",
        label: "Estou bem",
        message:
          "[ADICIONAR TEXTO] Escreva algo para o dia em que ela estiver bem — comemore com ela.",
        closing: "",
      },
      {
        id: "mo2",
        label: "Estou cansada",
        message:
          "[ADICIONAR TEXTO] Escreva algo para quando ela estiver exausta. Sem cobrança, só descanso.",
        closing: "",
      },
      {
        id: "mo3",
        label: "Estou triste",
        message:
          "[ADICIONAR TEXTO] Escreva algo para os dias tristes. Não tente consertar — só fique perto.",
        closing: "",
      },
      {
        id: "mo4",
        label: "Estou com medo",
        message:
          "[ADICIONAR TEXTO] Escreva algo para quando ela estiver com medo do que vem pela frente.",
        closing: "",
      },
      {
        id: "mo5",
        label: "Não sei",
        message:
          "[ADICIONAR TEXTO] Escreva algo para quando ela não souber nomear o que sente. Tudo bem não saber.",
        closing: "",
      },
    ],
    footer: "Seja qual for a resposta, eu continuo aqui.",
  },

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

  breathing: {
    enabled: true,
    label: "Respira comigo",
    inhale: "Inspira",
    hold: "Segura",
    exhale: "Solta",
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 6,
    cycles: 4,
    endMessage: "Pronto. Um minuto inteiro só seu.",
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

  voice: {
    enabled: true,
    title: "Quando quiser me ouvir",
    intro: "Aperte o play. Sou eu.",
    items: [
      {
        id: "a1",
        title: "[ADICIONAR TÍTULO] ex.: Para os dias difíceis",
        description: "[ADICIONAR TEXTO] Quando ela deveria ouvir esse áudio.",
        src: "", // grave no painel ou use /assets/audio/nome.mp3
      },
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

  game: {
    question: "Quanto você acha que eu te amo?",
    options: ["Pouco", "Muito", "Absurdamente muito"],
    wrong: "Errado.",
    explain: "Não existe uma opção grande o suficiente.",
    retry: "tentar de novo",
  },

  holdHand: {
    enabled: true,
    title: "Segura aqui",
    prompt: "Pressione e segure",
    holding: "Estou aqui.",
    message:
      "[ADICIONAR TEXTO] Escreva o que ela lê depois de segurar. Algo curto e verdadeiro.",
    seconds: 5,
  },

  wish: {
    enabled: true,
    prompt: "toque no céu e faça um pedido",
    message: "[ADICIONAR TEXTO] O que ela lê depois do pedido.",
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
    love: "Eu te amo.",
    promise:
      "Nos dias em que o mundo parecer leve.\nE nos dias em que ele parecer pesado demais.\nEu estarei aqui.",
    closing: "Enquanto você quiser minha mão, ela será sua.",
    birthdayLine: "Feliz aniversário, meu amor.",
    counterLabel: "juntos há",
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
