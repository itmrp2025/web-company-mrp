import { useTranslations } from "next-intl";
import { cms } from "@/utils/helpers/fetchCmsPage";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

export function StatsSection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("stats");
  const lang = locale as "id" | "en";

  const stats = [
    {
      value: cms(content, "years_value", "20+"),
      label: cms(content, `years_label_${lang}`, t("years")),
    },
    {
      value: cms(content, "clients_value", "500+"),
      label: cms(content, `clients_label_${lang}`, t("clients")),
    },
    {
      value: cms(content, "cases_value", "1000+"),
      label: cms(content, `cases_label_${lang}`, t("cases")),
    },
    {
      value: cms(content, "areas_value", "13"),
      label: cms(content, `areas_label_${lang}`, t("areas")),
    },
  ];

  return (
    <section className="bg-primary py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center px-6 py-10 sm:py-12 text-center
                ${i < stats.length - 1 ? "border-r border-white/15" : ""}
                ${i < 2 ? "lg:border-b-0 border-b border-white/15" : ""}
              `}
            >
              <p className="font-sans text-5xl font-semibold text-white sm:text-6xl">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-200">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

