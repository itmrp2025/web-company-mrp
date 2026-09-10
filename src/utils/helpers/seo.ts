import type { Metadata } from "next";
import { serverFetch } from "./serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface SeoSetting {
  page_slug: string;
  locale: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  robots: string;
}

interface SeoFallback {
  title: string;
  description?: string;
}

interface BuildMetadataArgs {
  /** Slug halaman di tabel seo_settings, mis. "about". */
  slug: string;
  locale: string;
  /** Dipakai bila DB kosong atau backend tidak bisa dihubungi. */
  fallback: SeoFallback;
  /** Path relatif untuk canonical, mis. "/about". Default: "/{slug}". */
  path?: string;
}

/**
 * Susun metadata Next.js dengan database sebagai sumber utama dan
 * terjemahan i18n sebagai cadangan.
 *
 * `serverFetch` sudah mengembalikan null bila backend mati atau baris belum
 * ada (404) — halaman tetap punya metadata dari fallback.
 *
 * Penggabungan dilakukan per-field, bukan semua-atau-tidak sama sekali:
 * bila admin hanya mengisi og_image, judul tetap memakai terjemahan.
 */
export async function buildMetadata({
  slug,
  locale,
  fallback,
  path,
}: BuildMetadataArgs): Promise<Metadata> {
  const seo = await serverFetch<SeoSetting>(`/seo/pages/${slug}`, { locale });

  const title = seo?.meta_title?.trim() || fallback.title;
  const description = seo?.meta_description?.trim() || fallback.description;

  const canonical =
    seo?.canonical_url?.trim() || `${SITE_URL}/${locale}${path ?? `/${slug}`}`;

  const ogImage = seo?.og_image?.trim();

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: seo?.og_title?.trim() || title,
      description: seo?.og_description?.trim() || description,
      url: canonical,
      siteName: "MRP Law Office",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };

  // Hanya set robots bila admin memilih selain nilai default, agar tidak
  // menimpa perilaku bawaan Next.js tanpa alasan.
  const robots = seo?.robots?.trim();
  if (robots && robots !== "index, follow") {
    metadata.robots = robots;
  }

  return metadata;
}
