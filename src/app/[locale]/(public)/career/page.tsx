import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { ArrowRight, MapPin, Clock, Calendar, Briefcase, Star, Users, Globe } from "lucide-react";
import { serverFetch } from "@/utils/helpers/serverFetch";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { buildMetadata } from "@/utils/helpers/seo";
import type { JobListing } from "@/interface/admin.interface";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career" });
  return buildMetadata({
    slug: "career",
    locale,
    path: "/career",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

const perkIcons = [Star, Users, Globe, Briefcase];

export default async function CareerPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "career" });

  const jobs = await serverFetch<JobListing[]>("/career") ?? [];
  const openJobs = jobs.filter((j) => j.status === "open");

  const cmsData = await fetchCmsPage("career");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const perksSection = getSectionContent(sections, "perks");
  const cms = (c: Record<string, string>, k: string, fb: string) => c[k] || fb;

  const perkLabels = [
    cms(perksSection, `perk1_${lang}`, t("perks.competitive")),
    cms(perksSection, `perk2_${lang}`, t("perks.collaborative")),
    cms(perksSection, `perk3_${lang}`, t("perks.international")),
    cms(perksSection, `perk4_${lang}`, t("perks.career_dev")),
  ];

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop")}
      />

      {/* Perks */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-px bg-neutral-100 md:grid-cols-4">
            {perkIcons.map((Icon, i) => (
              <div key={i} className="bg-white p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center border border-neutral-100">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-neutral-700">{perkLabels[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-8">{t("open_positions")}</p>
          {openJobs.length === 0 ? (
            <div className="bg-white border border-neutral-100 p-12 text-center">
              <p className="text-neutral-400 text-sm">{t("no_openings")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openJobs.map((job) => {
                const title = lang === "id" ? job.content.title_id : job.content.title_en;
                const desc = lang === "id" ? job.content.description_id : job.content.description_en;
                const reqs = lang === "id" ? job.content.requirements_id : job.content.requirements_en;
                const reqLines = reqs?.split("\n").filter(Boolean) ?? [];

                return (
                  <div key={job.id} className="bg-white border border-neutral-100 p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <span className="section-label mb-2 block">{job.employment_type}</span>
                        <h3 className="mb-4 font-sans text-xl font-semibold text-neutral-900">{title}</h3>
                        <div className="flex flex-wrap gap-5 text-sm text-neutral-400">
                          {job.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{job.employment_type}</span>
                          </div>
                          {job.deadline && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{t("deadline")}: {new Date(job.deadline).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/career/${job.slug}`}
                        className="inline-flex shrink-0 items-center gap-2 bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                      >
                        {t("apply_now")} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {(desc || reqLines.length > 0) && (
                      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 border-t border-neutral-50 pt-6">
                        {desc && (
                          <div>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{t("responsibilities")}</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                          </div>
                        )}
                        {reqLines.length > 0 && (
                          <div>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{t("requirements")}</h4>
                            <ul className="space-y-2">
                              {reqLines.map((req, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                                  <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                                  {req.replace(/^[-*•]\s*/, "")}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
