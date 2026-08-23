import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * `base: "./"` faz o site funcionar tanto na raiz de um domínio quanto dentro
 * de uma subpasta — que é o caso do GitHub Pages em
 * https://usuario.github.io/nome-do-repositorio/.
 * Se um dia usar domínio próprio, pode deixar como está: continua funcionando.
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? "./",
  plugins: [react()],
});
