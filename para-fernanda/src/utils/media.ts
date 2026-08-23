/**
 * Converte um arquivo de imagem em data URL comprimida (JPEG, máx. 1280px).
 * Mantém o localStorage leve o suficiente para várias fotos.
 * Para produção com muitas fotos, prefira colocar os arquivos em
 * /public/assets/photos e usar o caminho (ex.: /assets/photos/foto.jpg).
 */
export function fileToCompressedDataUrl(file: File, maxSize = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponível."));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Ajusta caminhos absolutos (ex.: /assets/photos/foto.jpg) ao caminho base do
 * site. Necessário quando o site é publicado numa subpasta, como no GitHub
 * Pages (usuario.github.io/repositorio/). Data URLs e links http(s) passam
 * intactos.
 */
export function assetUrl(path?: string): string | undefined {
  if (!path) return path;
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/$/, "") + path;
}
