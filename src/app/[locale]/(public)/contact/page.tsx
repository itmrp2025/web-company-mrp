import { getTranslations } from "next-intl/server";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { buildMetadata } from "@/utils/helpers/seo";
import { ContactClient } from "./ContactClient";
import { ReviewForm } from "@/components/public/ReviewForm";
import { PageHero } from "@/components/public/layout/PageHero";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    slug: "contact",
    locale,
    path: "/contact",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "contact" });
  const cmsData = await fetchCmsPage("contact");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const info = getSectionContent(sections, "contact_info");

  // CMS values dengan fallback ke i18n/hardcoded
  const cms = (c: Record<string, string>, k: string, fb: string) => c[k] || fb;

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop")}
      />
      <ContactClient
        locale={locale}
        phone={cms(info, "phone", "(+62) 21 50300825")}
        whatsapp={cms(info, "whatsapp", "+62 812 3456 7890")}
        email={cms(info, "email", "info@mrplawoffice.com")}
        address={cms(info, `address_${lang}`, t("address_value"))}
        hoursWeekday={cms(info, `hours_weekday_${lang}`, lang === "id" ? "Senin – Jumat, 08:00 – 17:00" : "Monday – Friday, 08:00 – 17:00")}
        hoursSaturday={cms(info, `hours_saturday_${lang}`, lang === "id" ? "Sabtu, 09:00 – 13:00" : "Saturday, 09:00 – 13:00")}
        hoursSunday={cms(info, `hours_sunday_${lang}`, lang === "id" ? "Minggu, Tutup" : "Sunday, Closed")}
      />
      <ReviewForm />
    </>
  );
}
