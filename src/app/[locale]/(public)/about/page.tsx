import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Button } from "@/components/custom-ui/Button";
import { PageHero } from "@/components/public/layout/PageHero";
import { ArrowRight, Eye, Target, Heart, Users, Globe, Scale } from "lucide-react";
import { fetchCmsPage, getSectionContent, cms } from "@/utils/helpers/fetchCmsPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("heading") };
}

const valueIcons = {
  integrity: Scale,
  collaboration: Users,
  innovation: Globe,
  commitment: Heart,
} as const;

const VALUE_KEYS = ["integrity", "collaboration", "innovation", "commitment"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "about" });

  const cmsData = await fetchCmsPage("about");
  const sections = cmsData?.sections;

  const hero = getSectionContent(sections, "hero");
  const story = getSectionContent(sections, "story");
  const stats = getSectionContent(sections, "stats");
  const vm = getSectionContent(sections, "vision_mission");
  const values = getSectionContent(sections, "values");
  const cta = getSectionContent(sections, "cta");

  const statsData = [
    {
      value: cms(stats, "stat_founded_value", "2001"),
      label: cms(stats, `stat_founded_${lang}`, t("stat_founded")),
    },
    {
      value: cms(stats, "stat_years_value", "15+"),
      label: cms(stats, `stat_years_${lang}`, t("stat_years")),
    },
    {
      value: cms(stats, "stat_cases_value", "1000+"),
      label: cms(stats, `stat_cases_${lang}`, t("stat_cases")),
    },
    {
      value: cms(stats, "stat_clients_value", "500+"),
      label: cms(stats, `stat_clients_${lang}`, t("stat_clients")),
    },
  ];

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `intro_${lang}`, t("intro"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1600&q=80&auto=format&fit=crop")}
      />

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="section-label mb-4">{cms(story, `story_heading_${lang}`, t("story_heading"))}</p>
              <h2 className="mb-6 text-3xl font-semibold text-neutral-900">
                {cms(story, `story_title_${lang}`, t("story_title"))}
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>{cms(story, `story_p1_${lang}`, t("story_p1"))}</p>
                <p>{cms(story, `story_p2_${lang}`, t("story_p2"))}</p>
                <p>{cms(story, `story_p3_${lang}`, t("story_p3"))}</p>
              </div>
              <Button href="/our-team" className="mt-8" endIcon={<ArrowRight className="h-4 w-4" />}>
                {cms(story, `team_cta_${lang}`, t("team_cta"))}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((s, i) => (
                <div key={i} className="border border-neutral-100 p-8 text-center">
                  <p className="font-sans text-4xl font-semibold text-primary">{s.value}</p>
                  <p className="mt-1.5 text-xs tracking-[0.1em] uppercase text-neutral-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-white border border-neutral-100 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center border border-primary/20 bg-primary/5">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-neutral-900">
                {cms(vm, `vision_heading_${lang}`, t("vision_heading"))}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {cms(vm, `vision_text_${lang}`, t("vision_text"))}
              </p>
            </div>
            <div className="bg-white border border-neutral-100 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center border border-accent/20 bg-accent/5">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-neutral-900">
                {cms(vm, `mission_heading_${lang}`, t("mission_heading"))}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {cms(vm, `mission_text_${lang}`, t("mission_text"))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">{cms(values, `values_heading_${lang}`, t("values_heading"))}</p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              {cms(values, `values_title_${lang}`, t("values_title"))}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_KEYS.map((key) => {
              const Icon = valueIcons[key];
              return (
                <div key={key} className="bg-white p-8 text-center">
                  <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center border border-neutral-100">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-neutral-900">
                    {cms(values, `${key}_${lang}`, t(`values.${key}.label`))}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {cms(values, `${key}_desc_${lang}`, t(`values.${key}.desc`))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/gedung.webp')", backgroundAttachment: "fixed" }}
        />
        <div className="absolute inset-0 bg-neutral-950/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-sans text-2xl font-semibold">
              {cms(cta, `cta_heading_${lang}`, t("cta_heading"))}
            </h2>
            <p className="mt-2 text-neutral-400 text-sm">
              {cms(cta, `cta_sub_${lang}`, t("cta_sub"))}
            </p>
          </div>
          <Button color="accent" size="lg" href="/contact" className="shrink-0">
            {cms(cta, `cta_btn_${lang}`, t("cta_btn"))}
          </Button>
        </div>
      </section>
    </>
  );
}
