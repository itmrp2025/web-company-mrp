"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cms } from "@/utils/helpers/fetchCmsPage";
import { YEARS_OF_EXPERIENCE } from "@/utils/constants/site.config";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

export function HeroSection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("hero");
  const lang = locale as "id" | "en";

  const imageRaw = cms(content, "image_url");
  const bgImage = imageRaw
    ? `url('${imageRaw}')`
    : "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop')";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading", { years: YEARS_OF_EXPERIENCE }));
  const ctaPrimary = cms(content, `cta_primary_${lang}`, t("cta_primary"));
  const ctaSecondary = cms(content, `cta_secondary_${lang}`, t("cta_secondary"));

  return (
    <section className="relative flex min-h-[580px] items-center bg-neutral-950 text-white sm:min-h-[640px] lg:min-h-[700px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: bgImage }}
      />
      <div className="absolute inset-0 bg-neutral-950/72" />

      {/* Left edge accent */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-primary-400/60 to-transparent" />

      {/* Content */}
      <div className="relative w-full">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
          <div className="max-w-2xl xl:max-w-3xl">

            {/* Eyebrow */}
            <div className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                {badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-7 font-sans text-[2.6rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]">
              {heading}
            </h1>

            {/* Subheading */}
            <p className="mb-12 max-w-xl text-[0.97rem] leading-[1.85] text-neutral-400 sm:text-base">
              {subheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-medium text-neutral-300 transition-colors hover:border-white/40 hover:text-white"
              >
                {ctaSecondary}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/40 to-transparent" />
    </section>
  );
}

