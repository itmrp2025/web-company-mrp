import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { Button } from "@/components/custom-ui/Button";
import { ArrowRight, Scale, Building2, ShieldCheck, Gavel, Globe, ShoppingBag, Home, Users, FileText, Briefcase, Plane, Leaf } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchCmsPage, getSectionContent, cms } from "@/utils/helpers/fetchCmsPage";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("heading") };
}

const iconMap: Record<string, React.ElementType> = {
  litigation: Gavel, corporate: Building2, regulatory: ShieldCheck,
  professional: Scale, digital: Globe, ecommerce: ShoppingBag,
  property: Home, family: Users, employment: Briefcase,
  intellectual: FileText, immigration: Plane, environmental: Leaf, criminal: Scale,
};

const serviceKeys = [
  "litigation", "corporate", "regulatory", "professional",
  "digital", "ecommerce", "property", "family",
  "employment", "intellectual", "immigration", "environmental", "criminal",
] as const;

export default async function ServicesPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "services" });

  const cmsData = await fetchCmsPage("services");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const servicesList = getSectionContent(sections, "services_list");
  const cta = getSectionContent(sections, "cta");

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80&auto=format&fit=crop")}
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-3">
            {serviceKeys.map((slug) => {
              const Icon = iconMap[slug] ?? Scale;
              const name = cms(servicesList, `${slug}_name_${lang}`, t(`items.${slug}.name`));
              const desc = cms(servicesList, `${slug}_desc_${lang}`, t(`items.${slug}.desc`));
              return (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="group bg-white p-8 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="mb-5 h-7 w-7 text-primary transition-colors group-hover:text-white/80" />
                  <h3 className="mb-2 text-base font-semibold text-neutral-900 transition-colors group-hover:text-white">
                    {name}
                  </h3>
                  <p className="mb-5 text-sm text-neutral-500 leading-relaxed transition-colors group-hover:text-white/70">
                    {desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors group-hover:text-white/80">
                    {t("cta_consult")} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-14 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-sans text-xl font-semibold text-neutral-900">
              {cms(cta, `cta_title_${lang}`, t("cta_title"))}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {cms(cta, `cta_sub_${lang}`, t("cta_sub"))}
            </p>
          </div>
          <Button href="/contact" endIcon={<ArrowRight className="h-4 w-4" />} className="shrink-0">
            {cms(cta, `cta_contact_${lang}`, t("cta_contact"))}
          </Button>
        </div>
      </section>
    </>
  );
}
