"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Button } from "@/components/custom-ui/Button";
import {
  ArrowRight, Scale, Building2, ShieldCheck, Gavel,
  ShoppingBag, Home, Users, Briefcase,
} from "lucide-react";
import { cms } from "@/utils/helpers/fetchCmsPage";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

export function ServicesSection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("servicesSection");
  const lang = locale as "id" | "en";

  const services = [
    { icon: Gavel, key: "litigation", slug: "litigation" },
    { icon: Building2, key: "corporate", slug: "corporate" },
    { icon: ShieldCheck, key: "regulatory", slug: "regulatory" },
    { icon: Scale, key: "professional", slug: "professional" },
    { icon: ShoppingBag, key: "ecommerce", slug: "ecommerce" },
    { icon: Home, key: "property", slug: "property" },
    { icon: Users, key: "family", slug: "family" },
    { icon: Briefcase, key: "employment", slug: "employment" },
  ] as const;

  // ponytail: show only 6 featured items on homepage; full list on /services
  const featured = services.slice(0, 6);

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));
  const viewAll = cms(content, `view_all_${lang}`, t("viewAll"));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const itemWidthOf = (el: HTMLDivElement) => el.clientWidth * 0.85 + 16; // w-[85%] + gap-4

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = itemWidthOf(el);
    if (itemWidth <= 0) return;
    const index = Math.round(el.scrollLeft / itemWidth);
    setActiveIndex(Math.max(0, Math.min(index, featured.length - 1)));
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = itemWidthOf(el);
    el.scrollTo({ left: index * itemWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-neutral-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label mb-4">{badge}</p>
            <h2 className="max-w-xl text-neutral-900">{heading}</h2>
            <p className="mt-4 max-w-lg text-neutral-500 leading-relaxed">{subheading}</p>
          </div>
          <Button
            variant="outlined"
            color="neutral"
            href="/services"
            endIcon={<ArrowRight className="h-4 w-4" />}
            className="shrink-0 self-start sm:self-auto"
          >
            {viewAll}
          </Button>
        </div>

        {/* Services List: Carousel on mobile, Grid on tablet/desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-visible sm:bg-neutral-200 sm:p-0 sm:pb-0 sm:snap-none lg:grid-cols-3"
        >
          {featured.map((service) => {
            const Icon = service.icon;
            const name = cms(content, `${service.key}_name_${lang}`, t(`items.${service.key}.name`));
            const desc = cms(content, `${service.key}_desc_${lang}`, t(`items.${service.key}.desc`));
            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex w-[85%] shrink-0 flex-col justify-between border border-neutral-200/80 bg-white p-8 snap-center transition-colors duration-200 hover:bg-primary sm:w-auto sm:border-0 sm:p-10 sm:snap-align-none"
              >
                <div>
                  {/* Arrow top-right on hover */}
                  <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center bg-primary/8 transition-colors group-hover:bg-white/15">
                    <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-white">
                    {name}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed transition-colors group-hover:text-white/70">
                    {desc}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-white/80">
                  {t("detail")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>

        {/* Dot indicators - mobile carousel only */}
        <div className="mt-5 flex justify-center gap-2 sm:hidden">
          {featured.map((service, i) => (
            <button
              key={service.slug}
              onClick={() => scrollToIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === activeIndex ? "w-6 bg-primary" : "w-2 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}