import { getTranslations } from "next-intl/server";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { buildMetadata } from "@/utils/helpers/seo";
import { FaqClient } from "./FaqClient";
import { PageHero } from "@/components/public/layout/PageHero";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return buildMetadata({
    slug: "faq",
    locale,
    path: "/faq",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "faq" });
  const cmsData = await fetchCmsPage("faq");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const ctaSection = getSectionContent(sections, "cta");
  const cms = (c: Record<string, string>, k: string, fb: string) => c[k] || fb;

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&auto=format&fit=crop")}
      />
      <FaqClient
        locale={locale}
        contactPrompt={cms(ctaSection, `prompt_${lang}`, t("contact_prompt"))}
        contactDesc={cms(ctaSection, `desc_${lang}`, t("contact_desc"))}
        contactCta={cms(ctaSection, `cta_${lang}`, t("contact_cta"))}
      />
    </>
  );
}
