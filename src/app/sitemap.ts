import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { serverFetch } from "@/utils/helpers/serverFetch";
import type { Article } from "@/interface/admin.interface";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Halaman statis beserta bobot prioritasnya. */
const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/services", priority: 0.9 },
  { path: "/our-team", priority: 0.8 },
  { path: "/articles", priority: 0.8 },
  { path: "/gallery", priority: 0.6 },
  { path: "/career", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
];

/** Slug layanan — sama dengan validSlugs di services/[slug]/page.tsx. */
const SERVICE_SLUGS = [
  "litigation", "corporate", "regulatory", "professional",
  "digital", "ecommerce", "property", "family",
  "employment", "intellectual", "immigration", "environmental", "criminal",
];

/**
 * Bangun URL untuk satu path di semua locale, lengkap dengan tautan
 * alternatif agar mesin telusur tahu ini halaman yang sama dalam bahasa lain.
 */
function localizedEntries(
  path: string,
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: "weekly" as const,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    entries.push(...localizedEntries(page.path, page.priority));
  }

  for (const slug of SERVICE_SLUGS) {
    entries.push(...localizedEntries(`/services/${slug}`, 0.7));
  }

  // Artikel diambil dari API. serverFetch mengembalikan null bila backend
  // tidak bisa dihubungi — sitemap tetap terbit dengan halaman statis
  // daripada gagal sepenuhnya.
  const articles = await serverFetch<Article[]>("/articles");
  if (articles) {
    for (const article of articles) {
      if (article.status !== "published") continue;
      const lastMod = article.updated_at
        ? new Date(article.updated_at)
        : undefined;
      entries.push(...localizedEntries(`/articles/${article.slug}`, 0.6, lastMod));
    }
  }

  return entries;
}
