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

As edições do painel ficam no **localStorage do navegador em que você editou**.
Para publicar o site já personalizado para a Fernanda, você tem duas opções:

- **Opção simples:** edite tudo direto em `src/data/defaultContent.ts`
  (pode usar Exportar no painel e copiar os valores do JSON para lá), rode
  `npm run build` e publique a pasta `dist/` (Vercel, Netlify, GitHub Pages...).
  Assim o conteúdo já vem embutido para qualquer dispositivo.
- **Opção futura:** o armazenamento é isolado em `src/store/contentStore.tsx`
  (funções `loadContent`/`saveContent`). Para sincronizar entre dispositivos,
  basta trocar essas duas funções por chamadas a Supabase/Firebase — nenhuma
  outra parte do código precisa mudar.

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
