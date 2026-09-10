import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Button } from "@/components/custom-ui/Button";
import { PageHero } from "@/components/public/layout/PageHero";
import { ArrowRight } from "lucide-react";
import { fetchCmsPage, getSectionContent, cms } from "@/utils/helpers/fetchCmsPage";
import { TeamGrid } from "@/components/public/sections/team/TeamGrid";
import type { Attorney } from "@/components/public/sections/team/TeamGrid";
import { serverFetch } from "@/utils/helpers/serverFetch";
import type { TeamMember } from "@/interface/admin.interface";
import { buildMetadata } from "@/utils/helpers/seo";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return buildMetadata({
    slug: "team",
    locale,
    path: "/our-team",
    fallback: { title: t("heading"), description: t("subheading") },
  });
}

function mapTeamMembers(members: TeamMember[], lang: "id" | "en"): Attorney[] {
  return members.map((m) => ({
    id: m.id,
    name: lang === "id" ? m.content.name_id : m.content.name_en,
    title: lang === "id" ? m.content.title_id : m.content.title_en,
    roleType: m.role_type === "founder" ? "founder" : "associate",
    photo: m.photo_url,
    bio: { id: m.content.bio_id, en: m.content.bio_en },
    credentials: [],
    specializations: m.content.specializations ?? [],
    linkedin: m.linkedin_url || undefined,
    instagram: m.instagram_url || undefined,
    email: m.email || undefined,
  }));
}

export default async function OurTeamPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "team" });

  const cmsData = await fetchCmsPage("team");
  const sections = cmsData?.sections;
  const hero = getSectionContent(sections, "hero");
  const careerCta = getSectionContent(sections, "career_cta");
  const labelsSection = getSectionContent(sections, "labels");

  const members = await serverFetch<TeamMember[]>("/team") ?? [];
  const attorneys = mapTeamMembers(members, lang);

  return (
    <>
      <PageHero
        badge={cms(hero, `badge_${lang}`, t("badge"))}
        heading={cms(hero, `heading_${lang}`, t("heading"))}
        subheading={cms(hero, `subheading_${lang}`, t("subheading"))}
        imageUrl={cms(hero, "image_url", "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1600&q=80&auto=format&fit=crop")}
      />

      <TeamGrid
        attorneys={attorneys}
        locale={lang}
        labels={{
          founderLabel: cms(labelsSection, `role_founder_${lang}`, t("founder_label")),
          associatesLabel: cms(labelsSection, `associates_label_${lang}`, t("associates_label")),
          viewProfileLabel: t("view_profile"),
          founderBadge: cms(labelsSection, `role_founder_${lang}`, t("founder_badge")),
        }}
      />

      <section className="relative py-14 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/gedung.webp')", backgroundAttachment: "fixed" }}
        />
        <div className="absolute inset-0 bg-neutral-950/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-sans text-2xl font-semibold">
              {cms(careerCta, `career_cta_${lang}`, t("career_cta"))}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              {cms(careerCta, `career_sub_${lang}`, t("career_sub"))}
            </p>
          </div>
          <Button color="accent" href="/career" endIcon={<ArrowRight className="h-4 w-4" />} className="shrink-0">
            {cms(careerCta, `career_btn_${lang}`, t("career_btn"))}
          </Button>
        </div>
      </section>
    </>
  );
}
