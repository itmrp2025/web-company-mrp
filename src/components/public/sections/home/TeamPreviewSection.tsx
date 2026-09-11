import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/custom-ui/Avatar";
import { YEARS_OF_EXPERIENCE } from "@/utils/constants/site.config";

const featured = [
  { slug: "dodi", titleKey: "role_founder" as const, specs: ["Corporate Law", "International Law", "Dispute Resolution"] },
  { slug: "tabrani", titleKey: "role_senior" as const, specs: ["Advocate", "Mediator", "Curator"] },
  { slug: "purwadi", titleKey: "role_senior" as const, specs: ["Banking Law", "Bankruptcy"] },
  { slug: "ahmad", titleKey: "role_associate" as const, specs: ["Banking Law", "Commercial Litigation"] },
];

export function TeamPreviewSection() {
  const t = useTranslations("teamSection");
  const tTeam = useTranslations("team");

  return (
    <section className="bg-neutral-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label mb-4">{t("badge")}</p>
            <h2 className="text-neutral-900">{t("heading")}</h2>
            <p className="mt-4 max-w-lg text-neutral-500 leading-relaxed">{t("subheading")}</p>
          </div>
          <Button
            variant="outlined"
            color="neutral"
            href="/our-team"
            endIcon={<ArrowRight className="h-4 w-4" />}
            className="shrink-0 self-start sm:self-auto"
          >
            {t("viewAll")}
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((member) => (
            <div key={member.slug} className="group bg-white p-8 hover:bg-neutral-50 transition-colors">
              <div className="mb-6 flex justify-start">
                <Avatar
                  fallback={tTeam(`${member.slug}_name`)}
                  size="xl"
                  className="h-20 w-20 text-2xl"
                />
              </div>
              <p className="section-label mb-2">{tTeam(member.titleKey)}</p>
              <h3 className="mb-1 text-base font-semibold text-neutral-900">
                {tTeam(`${member.slug}_name`)}
              </h3>
              <p className="mb-1 text-sm text-neutral-400">{tTeam(`${member.slug}_title`)}</p>
              <p className="mt-3 text-sm text-neutral-500 leading-relaxed line-clamp-3">
                {tTeam(`${member.slug}_bio`, { years: YEARS_OF_EXPERIENCE })}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {member.specs.map((s) => (
                  <span key={s} className="border border-neutral-100 px-2 py-1 text-[11px] text-neutral-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
