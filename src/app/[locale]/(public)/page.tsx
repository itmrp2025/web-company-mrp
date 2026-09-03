import { HeroSection } from "@/components/public/sections/home/HeroSection";
import { StatsSection } from "@/components/public/sections/home/StatsSection";
import { ServicesSection } from "@/components/public/sections/home/ServicesSection";
import { MeetLeadersSection } from "@/components/public/sections/home/MeetLeadersSection";
import { RecentArticlesSection } from "@/components/public/sections/home/RecentArticlesSection";
import { ConsultationCTASection } from "@/components/public/sections/home/ConsultationCTASection";
import { WhyChooseSection } from "@/components/public/sections/home/WhyChooseSection";
import { ProcessSection } from "@/components/public/sections/home/ProcessSection";
import { TestimonialsSection } from "@/components/public/sections/home/TestimonialsSection";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cmsData = await fetchCmsPage("home");
  const sections = cmsData?.sections;

  const hero = getSectionContent(sections, "hero");
  const stats = getSectionContent(sections, "stats");
  const servicesSection = getSectionContent(sections, "services_section");
  const meetLeaders = getSectionContent(sections, "meet_leaders");
  const recentArticles = getSectionContent(sections, "recent_articles");
  const cta = getSectionContent(sections, "cta");
  const whyChoose = getSectionContent(sections, "why_choose");
  const process = getSectionContent(sections, "process");
  const testimonials = getSectionContent(sections, "testimonials");

  return (
    <>
      <HeroSection content={hero} locale={locale} />
      <StatsSection content={stats} locale={locale} />
      <WhyChooseSection content={whyChoose} locale={locale} />
      <ServicesSection content={servicesSection} locale={locale} />
      <ProcessSection content={process} locale={locale} />
      <MeetLeadersSection content={meetLeaders} locale={locale} />
      <RecentArticlesSection content={recentArticles} />
      <TestimonialsSection content={testimonials} />
      <ConsultationCTASection content={cta} locale={locale} />
    </>
  );
}
