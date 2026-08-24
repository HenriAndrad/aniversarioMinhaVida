# Para Fernanda ❤️

Um presente digital: aniversário + carta de amor + álbum de memórias + declaração de apoio.
Feito com React, TypeScript, Vite, Tailwind CSS e Framer Motion.

## Como rodar

```bash
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a versão final em dist/
npm run preview   # testa a versão final
```

## As duas telas

| Rota | O que é |
| --- | --- |
| `/` (ou `#/`) | A experiência da Fernanda. Nada administrativo aparece aqui. |
| `#/admin` | Seu painel. Senha padrão: **`nosso-amor`** (troque na aba "Geral"). |

## Personalizando (sem tocar em código)

Abra `#/admin` e edite por categoria: Geral, Aniversário, Sobre ela, Nossa história,
Motivos, Memórias, Carta, Acolhimento, Mensagens surpresa, Música e Tema.

- **Tudo salva automaticamente** no navegador (localStorage).
- **Preview instantâneo**: botão no topo do painel abre o site ao lado; cada edição
  aparece na hora.
- **Exportar / Importar**: baixe um `.json` com todo o conteúdo para backup ou para
  levar as edições para outro computador/navegador.
- Onde você vir `[ADICIONAR ...]` no site, é conteúdo esperando você preencher.

### Fotos

Duas formas:

1. **Upload pelo painel** — a foto é comprimida e salva junto com o conteúdo.
   Ótimo para poucas fotos.
2. **Arquivos no projeto** — coloque em `public/assets/photos/` e digite o caminho
   (ex.: `/assets/photos/viagem.jpg`) no campo da foto. Melhor para muitas fotos
   ou fotos grandes: não ocupa o armazenamento do navegador.

Se o painel avisar "espaço cheio", migre as fotos maiores para a opção 2.

### Música

1. Coloque o arquivo em `public/assets/music/` (ex.: `music.mp3`).
2. No painel → Música, informe `/assets/music/music.mp3`.
3. A música começa quando ela clica em **"Entrar no nosso mundo"** (navegadores
   bloqueiam autoplay; por isso o início é sempre após a interação dela).
4. Opcional: configure músicas diferentes para início / memórias / momento
   emocional / final — a troca acontece com fade suave conforme ela navega.

### Conteúdo padrão

Os textos iniciais e placeholders vivem em `src/data/defaultContent.ts`.
O painel salva por cima deles; "Restaurar padrão" volta para esse arquivo.

## Importante: onde as edições ficam salvas

As edições do painel ficam no **localStorage do navegador em que você editou** —
ou seja, elas não viajam sozinhas para o site publicado.

Para publicar o conteúdo, o caminho mais fácil é:

1. no painel, clique em **Exportar** (baixa um `.json` com tudo);
2. substitua o arquivo **`public/content.json`** do repositório por esse JSON;
3. faça commit e push — o site no ar passa a mostrar esse conteúdo.

O site carrega `content.json` como base e o seu localStorage por cima, então
você continua editando pelo painel normalmente no seu navegador.

Alternativas: editar direto `src/data/defaultContent.ts` (o conteúdo fica
embutido no build), ou trocar `loadContent`/`saveContent` em
`src/store/contentStore.tsx` por chamadas a Supabase/Firebase — nenhuma outra
parte do código precisa mudar.

## Publicar no GitHub Pages (GitHub Actions)

O workflow já está pronto em `.github/workflows/deploy.yml`.

1. Crie o repositório no GitHub e suba o projeto:

   ```bash
   git init
   git add .
   git commit -m "Site para a Fernanda"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```

2. No GitHub, vá em **Settings → Pages** e, em *Build and deployment*, escolha
   **Source: GitHub Actions**. (Só precisa fazer isso uma vez.)
3. Pronto: cada push no branch `main` roda o build e publica. Acompanhe pela
   aba **Actions**; o endereço fica
   `https://SEU-USUARIO.github.io/SEU-REPO/`.

Observações:

- se o seu branch principal se chamar `master`, troque o nome no início do
  workflow;
- `vite.config.ts` usa `base: "./"`, então o site funciona tanto em subpasta
  (`/SEU-REPO/`) quanto em domínio próprio, sem configurar nada;
- se quiser deixar o repositório **privado**, o Pages exige plano pago —
  nesse caso use Vercel ou Netlify (também gratuitos e com repositório
  privado);
- a rota do painel é `.../#/admin`. A senha protege contra curiosos, mas o
  site é público: não coloque nada ali que você não queira que outra pessoa
  possa ver.

## O que ela pode fazer no site (as interações)

| Interação | Onde | O que acontece |
| --- | --- | --- |
| **Como você está agora?** | depois das memórias | Ela escolhe o estado dela (bem, cansada, triste, com medo, não sei) e recebe a mensagem que você escreveu para aquele momento. É a parte que ela mais vai reabrir em dias difíceis. |
| **Respira comigo** | dentro de "Quando tudo parecer pesado" | Um círculo que guia a respiração no ritmo que você configurar (4-4-6 por padrão). |
| **Vídeos** | depois das memórias | Galeria com capa e player em tela cheia. |
| **Minha voz** | depois de "Abra quando precisar" | Mensagens de áudio suas, com player em forma de onda. Some sozinho se não houver áudio. |
| **Segura aqui** | antes do final | Ela pressiona e segura a tela; a luz cresce, o círculo pulsa como um batimento e, ao completar, sua mensagem aparece. |
| **Estrela dos desejos** | no finalzinho | Ela toca, uma estrela cadente atravessa a tela e sua mensagem aparece. |
| **Estrelas dos motivos** | "Por que eu amo você" | Cada motivo é uma estrela clicável. |
| **A brincadeira do ∞** | perto do fim | Qualquer resposta está errada — não existe opção grande o suficiente. |
| **Envelope da carta** | "A carta" | A carta abre com animação de envelope. |
| **Contador ao vivo** | final | Dias, horas, minutos e segundos juntos. |

Cada uma dessas seções pode ser **ligada ou desligada** no painel, e some
sozinha se estiver sem conteúdo.

## O painel: o que dá para editar

Abas do painel (`#/admin`): Geral, Abertura, Aniversário, Sobre ela, Nossa
história, Motivos, Memórias, **Vídeos**, **Minha voz**, **Como você está**,
Carta, Acolhimento, **Interações**, **Jogo e final**, Mensagens surpresa,
Música, Tema.

Não há nenhum texto fixo no código: **tudo** o que ela lê sai do painel —
até a frase da abertura e o rótulo do contador.

Nos textos você pode usar `{nome}`, `{apelido}` e `{meunome}`; o site troca
pelos nomes configurados na aba Geral.

### Fotos, vídeos e áudios

- **Fotos**: upload direto no painel (comprimidas automaticamente) ou caminho
  em `public/assets/photos/`.
- **Vídeos**: como vídeo não cabe no armazenamento do navegador, coloque o
  `.mp4` em `public/assets/videos/` e informe o caminho — o botão "Escolher
  arquivo" já monta o caminho certo para você.
- **Áudios**: dá para **gravar sua voz direto no painel**. Áudios curtos podem
  ser usados na hora; nos longos, use "Baixar" e salve em
  `public/assets/audio/` (recomendado para o site publicado).

## Estrutura

```text
src/
├── admin/        # painel (/#/admin): login, categorias, preview, export/import
├── components/   # Starfield, MusicPlayer, Modal, ProgressNav, Reveal...
├── sections/     # cada seção da experiência
├── data/         # defaultContent.ts — todo o conteúdo editável
├── store/        # persistência + contexto (troque aqui para usar um backend)
├── hooks/        # useTimeTogether (contador em tempo real)
├── types/        # tipos de todo o conteúdo
└── utils/        # compressão de imagens etc.
public/assets/
├── photos/  music/  videos/  icons/
```

## Acessibilidade e performance

- `prefers-reduced-motion` respeitado em todas as animações;
- navegação por teclado, `aria-labels`, foco visível;
- lazy loading de imagens; canvas único e leve para as estrelas;
- mobile-first (testado a partir de 360px).
