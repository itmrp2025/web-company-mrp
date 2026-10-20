import { getInternalApiUrl } from "@/utils/helpers/internalApi";

const API_VERSION = process.env.NEXT_PUBLIC_VERSION_API ?? "v1";

// Produksi: respons di-cache 60 detik supaya backend/database tidak dipanggil di setiap
// kunjungan. Dev: tanpa cache supaya perubahan dari admin langsung terlihat.
const DEFAULT_REVALIDATE = process.env.NODE_ENV === "production" ? 60 : 0;

interface ServerFetchOptions {
  /** Lama cache dalam detik. 0 = tanpa cache. Default: 60 di produksi, 0 di dev. */
  revalidate?: number;
  /** Tag untuk revalidasi sesuai permintaan (revalidateTag) di kemudian hari. */
  tags?: string[];
}

/**
 * Ambil data dari backend di sisi server. Mengembalikan null bila backend tidak bisa
 * dihubungi atau responsnya bukan 2xx, supaya halaman jatuh ke teks terjemahan.
 *
 * Tanda tangan lama `serverFetch(path, params)` tetap berlaku; opsi cache adalah
 * argumen ketiga yang boleh dilewati.
 */
export async function serverFetch<T>(
  path: string,
  params?: Record<string, string>,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  // Di luar try: env yang salah harus gagal keras, bukan diam-diam jadi null.
  const base = getInternalApiUrl();
  const { revalidate = DEFAULT_REVALIDATE, tags } = options;
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";

  try {
    const url = new URL(`${base}/${API_VERSION}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), { next: { revalidate, tags } });
    if (!res.ok) {
      // 404 itu normal (mis. baris SEO belum ada), jadi tidak dicatat.
      if (res.status !== 404 && !isBuild) {
        console.error(`[serverFetch] ${path} -> HTTP ${res.status}`);
      }
      return null;
    }
    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch (err) {
    if (!isBuild) {
      console.error(`[serverFetch] ${path} gagal:`, err instanceof Error ? err.message : err);
    }
    return null;
  }
}