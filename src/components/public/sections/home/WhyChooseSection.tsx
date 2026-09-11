import { useTranslations } from "next-intl";
import { Clock, Users, UserCheck, Globe, BarChart3, Eye } from "lucide-react";
import { cms } from "@/utils/helpers/fetchCmsPage";
import { YEARS_OF_EXPERIENCE, YEARS_DISPLAY } from "@/utils/constants/site.config";

const icons = [Clock, Users, UserCheck, Globe, BarChart3, Eye] as const;

export function WhyChooseSection({ content = {}, locale = "id" }: { content?: Record<string, string>; locale?: string }) {
  const t = useTranslations("whyChoose");
  const lang = (locale ?? "id") as "id" | "en";

  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));

  const reasons = Array.from({ length: 6 }, (_, i) => ({
    icon: icons[i],
    title: cms(content, `reason${i + 1}_title_${lang}`, t(`reasons_v2.${i}.title`, { years: YEARS_OF_EXPERIENCE })),
    desc: cms(content, `reason${i + 1}_desc_${lang}`, t(`reasons_v2.${i}.desc`)),
  }));

  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start lg:gap-24">
          {/* Left â€” text */}
          <div className="lg:sticky lg:top-28">
            <h2 className="mb-6 text-neutral-900">{heading}</h2>
            <p className="mb-8 text-lg text-neutral-500 leading-relaxed">{subheading}</p>

            {/* Large decorative stat */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <p className="font-sans text-6xl font-semibold text-primary">{YEARS_DISPLAY}</p>
              <p className="mt-1 text-sm text-neutral-500 uppercase tracking-wider">{t("statYears")}</p>
            </div>

            {/* Supporting stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "500+", key: "statClients" },
                { value: "1000+", key: "statCases" },
                { value: "13", key: "statAreas" },
              ].map((s) => (
                <div key={s.key} className="bg-neutral-50 p-4 text-center border border-neutral-100">
                  <p className="font-sans text-2xl font-semibold text-neutral-900">{s.value}</p>
                  <p className="mt-1 text-[11px] text-neutral-400 uppercase tracking-wider leading-tight">{t(s.key)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right â€” icon cards */}
          <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-white p-7 hover:bg-neutral-50 transition-colors">
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/8 group-hover:bg-primary/12 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

