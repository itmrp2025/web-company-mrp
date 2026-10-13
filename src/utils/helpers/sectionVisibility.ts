/**
 * Section CMS dianggap tampil kecuali field `enabled` secara eksplisit "false".
 * Default tampil: kalau section belum pernah disimpan di admin (content kosong)
 * atau backend gagal diambil, perilaku lama tetap jalan.
 */
export function isSectionEnabled(content?: Record<string, string>): boolean {
  return content?.enabled !== "false";
}

/**
 * URL dari CMS dipakai di href. Hanya izinkan http(s) supaya input salah
 * (mis. "javascript:...") tidak ikut ter-render sebagai link.
 */
export function safeExternalUrl(url: string | undefined, fallback: string): string {
  const trimmed = url?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : fallback;
}