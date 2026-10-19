import { getInternalApiUrl } from "@/utils/helpers/internalApi";

const API_VERSION = process.env.NEXT_PUBLIC_VERSION_API ?? "v1";

// Produksi: cache 60 detik supaya database yang lambat tidak dipanggil di setiap
// kunjungan. Dev: tanpa cache supaya perubahan dari admin langsung terlihat.
const DEFAULT_REVALIDATE = process.env.NODE_ENV === "production" ? 60 : 0;

interface ServerFetchOptions {
  /** Detik sampai data dianggap kedaluwarsa. 0 = selalu ambil baru. */
  revalidate?: number;
  /** Tag cache, untuk invalidasi terarah lewat revalidateTag. */
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  params?: Record<string, string>,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  // Di luar try: env yang salah harus gagal keras, bukan diam-diam jatuh ke localhost.
  // Dipanggil di dalam fungsi (bukan di level modul) agar tidak gagal saat build
  // untuk halaman yang tidak memakainya.
  const base = getInternalApiUrl();

  try {
    const url = new URL(`${base}/${API_VERSION}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
      next: {
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE,
        tags: options.tags,
      },
    });
    if (!res.ok) return null;

    const json = await res.json();
    return (json.data as T) ?? null;
  } catch {
    return null;
  }
}