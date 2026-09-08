import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import { ArrowRight, ExternalLink, Award, BookOpen, Scale } from "lucide-react";
import { cms } from "@/utils/helpers/fetchCmsPage";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

export function MeetLeadersSection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("meetLeaders");
  const lang = locale as "id" | "en";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));
  const founderName = cms(content, "founder_name", t("founder_name"));
  const founderRole = cms(content, `founder_role_${lang}`, t("founder_role"));
  const founderBio = cms(content, `founder_bio_${lang}`, t("founder_bio"));
  const credential1 = cms(content, `credential_1_${lang}`, t("founder_credential_1"));
  const credential2 = cms(content, `credential_2_${lang}`, t("founder_credential_2"));
  const credential3 = cms(content, `credential_3_${lang}`, t("founder_credential_3"));
  const founderImageUrl = cms(content, "founder_image_url", "");
  const linkedinUrl = cms(content, "linkedin_url", "https://linkedin.com/in/dodi-abdulkadir");
  const instagramUrl = cms(content, "instagram_url", "https://instagram.com/dodisabdulkadir");
  const viewTeam = cms(content, `view_team_${lang}`, t("view_team"));

  const credentials = [
    { icon: BookOpen, label: credential1 },
    { icon: Scale,    label: credential2 },
    { icon: Award,    label: credential3 },
  ];

  const initial = founderName?.charAt(0) ?? "D";

  return (
    <section className="bg-white py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-4">{badge}</p>
          <h2 className="text-neutral-900">{heading}</h2>
          <p className="mx-auto mt-4 max-w-lg text-neutral-500 leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Founder – large feature card */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 border border-neutral-100">
          {/* Photo col */}
          <div className="relative min-h-[360px] bg-neutral-900 overflow-hidden lg:min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-primary-900" />
            <div className="absolute inset-6 border border-white/10" />
            {founderImageUrl ? (
              <Image
                src={founderImageUrl}
                alt={founderName}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-36 w-28 items-end justify-center overflow-hidden bg-neutral-700/60 border border-white/10">
                  <div className="h-32 w-24 bg-gradient-to-t from-neutral-600 to-neutral-500 flex items-center justify-center">
                    <span className="font-sans text-5xl font-bold text-white/30">{initial}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Name overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent px-8 pb-8 pt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-2">
                {founderRole}
              </p>
              <p className="font-sans text-xl font-bold text-white leading-snug">
                {founderName}
              </p>
            </div>
          </div>

          {/* Content col */}
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-neutral-50">
            <p className="section-label mb-3">{founderRole}</p>
            <h3 className="mb-1 font-sans text-2xl font-bold text-neutral-900 leading-snug">
              {founderName}
            </h3>

            <div className="my-6 h-px bg-neutral-200" />

            <p className="mb-8 text-base text-neutral-600 leading-relaxed">
              {founderBio}
            </p>

            {/* Credentials */}
            <ul className="mb-8 space-y-3">
              {credentials.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/8">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-neutral-700">{label}</span>
                </li>
              ))}
            </ul>

            {/* Social links */}
            <div className="mb-8 flex flex-wrap gap-3">
              {[
                { label: "LinkedIn", href: linkedinUrl },
                { label: "Instagram", href: instagramUrl },
              ].filter(({ href }) => href).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 hover:border-primary hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-auto">
              <Button
                href="/our-team"
                variant="outlined"
                color="neutral"
                endIcon={<ArrowRight className="h-4 w-4" />}
              >
                {viewTeam}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
