import { useTranslations } from "next-intl";
import { cms } from "@/utils/helpers/fetchCmsPage";

export function ProcessSection({ content = {}, locale = "id" }: { content?: Record<string, string>; locale?: string }) {
  const t = useTranslations("process");
  const lang = (locale ?? "id") as "id" | "en";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));

  const steps = Array.from({ length: 4 }, (_, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: cms(content, `step${i + 1}_title_${lang}`, t(`steps.${i + 1}.title`)),
    desc: cms(content, `step${i + 1}_desc_${lang}`, t(`steps.${i + 1}.desc`)),
  }));

  return (
    <section className="bg-neutral-900 py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="section-label mb-4 text-neutral-400">{badge}</p>
            <h2 className="text-white">{heading}</h2>
          </div>
          <p className="text-neutral-400 leading-relaxed lg:text-right lg:max-w-md lg:ml-auto">
            {subheading}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="bg-neutral-900 p-8 sm:p-10">
              <p className="mb-5 font-sans text-sm font-semibold text-primary tracking-widest">{num}</p>
              <h3 className="mb-3 text-base font-semibold text-white">{title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
