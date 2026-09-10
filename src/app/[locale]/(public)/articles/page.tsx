import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { buildMetadata } from "@/utils/helpers/seo";
import { ArticlesClient } from "./ArticlesClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return buildMetadata({
    slug: "articles",
    locale,
    path: "/articles",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "articles" });
  const cmsData = await fetchCmsPage("articles");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const cms = (c: Record<string, string>, k: string, fb: string) => c[k] || fb;

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1600&q=80&auto=format&fit=crop")}
      />
      <ArticlesClient locale={locale} />
    </>
  );
}
