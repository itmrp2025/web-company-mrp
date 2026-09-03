import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/layout/PageHero";
import { Button } from "@/components/custom-ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2, Phone } from "lucide-react";

const validSlugs = [
  "litigation", "corporate", "regulatory", "professional",
  "digital", "ecommerce", "property", "family",
  "employment", "intellectual", "immigration", "environmental", "criminal",
] as const;

type Slug = typeof validSlugs[number];

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug as Slug)) return { title: "MRP Law Office" };
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t(`items.${slug as Slug}.name` as Parameters<typeof t>[0]) };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug as Slug)) notFound();

  const t = await getTranslations({ locale, namespace: "services" });
  const sd = await getTranslations({ locale, namespace: "serviceDetail" });

  const s = slug as Slug;
  const benefitCount = parseInt(sd(`${s}.benefit_count` as Parameters<typeof sd>[0]) as string) || 4;
  const processCount = parseInt(sd(`${s}.process_count` as Parameters<typeof sd>[0]) as string) || 4;

  return (
    <>
      <PageHero
        badge={t("badge")}
        heading={t(`items.${s}.name` as Parameters<typeof t>[0])}
        subheading={t(`items.${s}.desc` as Parameters<typeof t>[0])}
        imageUrl="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80&auto=format&fit=crop"
        overlay="darker"
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="text"
              href="/services"
              color="neutral"
              startIcon={<ArrowLeft className="h-4 w-4" />}
              className="text-neutral-500 hover:text-neutral-900"
            >
              {t("all_services")}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <p className="section-label mb-4">{t("detail_overview_label")}</p>
              <h2 className="mb-6 font-sans text-2xl font-semibold text-neutral-900">
                {t("detail_what_we_do")}
              </h2>
              <p className="mb-10 text-neutral-600 leading-relaxed text-base">
                {t(`items.${s}.desc` as Parameters<typeof t>[0])}
              </p>

              <h3 className="mb-5 font-semibold text-neutral-900">
                {t("detail_coverage")}
              </h3>
              <ul className="space-y-3">
                {Array.from({ length: benefitCount }).map((_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-neutral-700 text-sm leading-relaxed">
                      {sd(`${s}.benefit_${i + 1}` as Parameters<typeof sd>[0]) as string}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="border border-neutral-100 p-6">
                <p className="section-label mb-5">{t("detail_our_process")}</p>
                <ol className="space-y-4">
                  {Array.from({ length: processCount }).map((_, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-primary text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm text-neutral-600 leading-snug">
                        {sd(`${s}.process_${i + 1}` as Parameters<typeof sd>[0]) as string}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-neutral-900 p-6 text-white">
                <p className="section-label mb-3 text-neutral-400">{t("detail_consult_label")}</p>
                <h3 className="mb-2 font-sans text-lg font-semibold">{t("detail_consult_heading")}</h3>
                <p className="mb-5 text-sm text-neutral-400">{t("detail_consult_sub")}</p>
                <Button color="accent" href="/contact" className="w-full justify-center">
                  {t("cta_contact")}
                </Button>
                <a
                  href="tel:+622150300825"
                  className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> (+62) 21 50300825
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-10 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-neutral-500">{t("detail_explore")}</p>
          <Button variant="outlined" color="neutral" href="/services" endIcon={<ArrowRight className="h-4 w-4" />}>
            {t("all_services")}
          </Button>
        </div>
      </section>
    </>
  );
}
