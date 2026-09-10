import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { GalleryGrid, type GalleryPhoto } from "@/components/public/GalleryGrid";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { serverFetch } from "@/utils/helpers/serverFetch";
import { buildMetadata } from "@/utils/helpers/seo";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return buildMetadata({
    slug: "gallery",
    locale,
    path: "/gallery",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

interface GalleryItem {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
  is_visible: boolean;
  content: { title_id?: string; title_en?: string; desc_id?: string; desc_en?: string };
}

export default async function GalleryPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "gallery" });

  const [cmsData, galleryItems] = await Promise.all([
    fetchCmsPage("gallery"),
    serverFetch<GalleryItem[]>("/gallery"),
  ]);

  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const cms = (c: Record<string, string>, k: string, fb: string) => c[k] || fb;

  const photos: GalleryPhoto[] = (galleryItems ?? []).map((item) => ({
    id: item.id,
    src: item.image_url,
    category: item.category,
    title: (lang === "id" ? item.content.title_id : item.content.title_en) ?? "",
    description: (lang === "id" ? item.content.desc_id : item.content.desc_en) ?? "",
    date: "",
  }));

  const categories = [...new Set((galleryItems ?? []).map((i) => i.category))]
    .filter(Boolean)
    .map((key) => ({ key, label: key }));

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1600&q=80&auto=format&fit=crop")}
      />

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid
            photos={photos}
            categories={categories}
            allLabel={t("all_categories")}
            noPhotosLabel={t("no_photos")}
          />
        </div>
      </section>
    </>
  );
}
