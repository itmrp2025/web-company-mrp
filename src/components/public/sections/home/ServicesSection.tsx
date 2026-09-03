import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import {
  ArrowRight, Scale, Building2, ShieldCheck, Gavel,
  Globe, ShoppingBag, Home, Users, Briefcase,
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
    { icon: Globe, key: "digital", slug: "digital" },
    { icon: ShoppingBag, key: "ecommerce", slug: "ecommerce" },
    { icon: Home, key: "property", slug: "property" },
    { icon: Users, key: "family", slug: "family" },
    { icon: Briefcase, key: "employment", slug: "employment" },
  ] as const;

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));
  const viewAll = cms(content, `view_all_${lang}`, t("viewAll"));

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

        {/* Grid */}
        <div className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            const name = cms(content, `${service.key}_name_${lang}`, t(`items.${service.key}.name`));
            const desc = cms(content, `${service.key}_desc_${lang}`, t(`items.${service.key}.desc`));
            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative bg-white p-8 sm:p-10 transition-colors duration-200 hover:bg-primary"
              >
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
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-white/80">
                  {t("detail")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
