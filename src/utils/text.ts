import type { Relationship } from "../types/content";

/**
 * Substitui marcadores nos textos editáveis pelo conteúdo do painel:
 * {nome} → nome dela, {apelido} → apelido, {meunome} → seu nome.
 * Assim você pode escrever "Boa noite, {apelido}" no painel.
 */
export function applyTokens(text: string, r: Relationship): string {
  return text
    .replace(/\{nome\}/gi, r.herName)
    .replace(/\{apelido\}/gi, r.nickname || r.herName)
    .replace(/\{meunome\}/gi, r.yourName);
}
