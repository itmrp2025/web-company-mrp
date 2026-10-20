export function getInternalApiUrl(): string {
  const url = process.env.API_INTERNAL_URL;
  if (url) return url.replace(/\/$/, "");

  // Saat `next build` (mis. di CI) backend tidak tersambung dan variabel ini belum tentu ada.
  // Di fase itu fetch dibiarkan gagal pelan-pelan (serverFetch mengembalikan null).
  // Saat server produksi sedang berjalan, env yang hilang harus gagal keras.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    throw new Error("API_INTERNAL_URL belum diset");
  }
  return "http://localhost:8080";
}