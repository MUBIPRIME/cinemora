const LINES: Record<string, string[]> = {
  en: ["This is a sample caption track.", "CINEMORA shows official previews only.", "Choose a streaming service to watch the full title."],
  es: ["Esta es una pista de subtítulos de muestra.", "CINEMORA solo muestra avances oficiales.", "Elige un servicio para ver el título completo."],
  fr: ["Ceci est une piste de sous-titres d'exemple.", "CINEMORA ne diffuse que des bandes-annonces officielles.", "Choisissez un service pour voir le film en entier."],
};

export function captionUrl(lang: string): string | null {
  const lines = LINES[lang];
  if (!lines) return null;
  const cues = lines.map((text, i) => {
    const start = i * 6, end = start + 5;
    const fmt = (s: number) => `00:00:${String(s).padStart(2, "0")}.000`;
    return `${i + 1}\n${fmt(start)} --> ${fmt(end)}\n${text}\n`;
  }).join("\n");
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT\n\n${cues}`)}`;
}
