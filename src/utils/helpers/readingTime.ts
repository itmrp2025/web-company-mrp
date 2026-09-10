/** Buang tag HTML + entity agar tersisa teks murni untuk dihitung. */
export function stripHtml(content: string): string {
  if (!content) return "";
  return content
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Estimasi waktu baca dalam menit. 200 wpm adalah kecepatan baca rata-rata
 * untuk teks non-teknis (berlaku serupa untuk ID maupun EN). Minimal 1 menit.
 */
export function readingTimeMinutes(content: string, wordsPerMinute = 200): number {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
