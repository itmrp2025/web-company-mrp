import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import { ArrowRight, ExternalLink, Award, BookOpen, Scale } from "lucide-react";
import { cms } from "@/utils/helpers/fetchCmsPage";
import { YEARS_OF_EXPERIENCE } from "@/utils/constants/site.config";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

/*FounderPhoto*/
function FounderPhoto({
  imageUrl,
  name,
  initial,
}: {
  imageUrl: string;
  name: string;
  initial: string;
}) {
  return (
    <div className="relative h-80 sm:h-90 lg:h-full lg:min-h-140 overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none ring-1 ring-inset ring-primary/20">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-800">
          <span className="font-sans text-7xl font-bold text-white/20">{initial}</span>
        </div>
      )}
    </div>
  );
}

/*FounderInfo*/
function FounderInfo({
  role,
  name,
  bio,
  credentials,
  linkedinUrl,
  instagramUrl,
  viewTeamLabel,
}: {
  role: string;
  name: string;
  bio: string;
  credentials: { icon: typeof BookOpen; label: string }[];
  linkedinUrl: string;
  instagramUrl: string;
  viewTeamLabel: string;
}) {
  const socials = [
    { label: "LinkedIn", href: linkedinUrl },
    { label: "Instagram", href: instagramUrl },
  ].filter(({ href }) => href);

  return (
<div className="flex flex-col justify-center p-8 sm:p-9 lg:p-10 bg-neutral-50 rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">    <p className="section-label mb-3">{role}</p>
      <h3 className="mb-1 font-sans text-2xl font-bold text-neutral-900 leading-snug">
        {name}
      </h3>

      <div className="my-5 h-px bg-neutral-200" />

      <p className="mb-6 text-base text-neutral-600 leading-relaxed">{bio}</p>

      <ul className="mb-6 space-y-3">
        {credentials.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/8">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-neutral-700">{label}</span>
          </li>
        ))}
      </ul>

      {socials.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {socials.map(({ label, href }) => (
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
      )}

      <div className="mt-auto">
        <Button href="/our-team" variant="outlined" color="neutral" endIcon={<ArrowRight className="h-4 w-4" />}>
          {viewTeamLabel}
        </Button>
      </div>
    </div>
  );
}

export function MeetLeadersSection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("meetLeaders");
  const lang = locale as "id" | "en";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));
  const founderName = cms(content, "founder_name", t("founder_name"));
  const founderRole = cms(content, `founder_role_${lang}`, t("founder_role"));
  const founderBio = cms(content, `founder_bio_${lang}`, t("founder_bio", { years: YEARS_OF_EXPERIENCE }));
  const credential1 = cms(content, `credential_1_${lang}`, t("founder_credential_1"));
  const credential2 = cms(content, `credential_2_${lang}`, t("founder_credential_2"));
  const credential3 = cms(content, `credential_3_${lang}`, t("founder_credential_3"));
  const founderImageUrl = cms(content, "founder_image_url", "");
  const linkedinUrl = cms(content, "linkedin_url", "");
  const instagramUrl = cms(content, "instagram_url", "");
  const viewTeam = cms(content, `view_team_${lang}`, t("view_team"));

  const credentials = [
    { icon: BookOpen, label: credential1 },
    { icon: Scale, label: credential2 },
    { icon: Award, label: credential3 },
  ];

  const initial = founderName?.charAt(0) ?? "D";

  return (
    <section className="bg-white py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-4">{badge}</p>
          <h2 className="text-neutral-900">{heading}</h2>
          <p className="mx-auto mt-4 max-w-lg text-neutral-500 leading-relaxed">{subheading}</p>
        </div>

        {/* Founder – large feature card: foto & teks terpisah, masing-masing sub-komponen sendiri */}
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 border border-neutral-100 rounded-2xl overflow-hidden">            <FounderPhoto imageUrl={founderImageUrl} name={founderName} initial={initial} />          <FounderInfo
            role={founderRole}
            name={founderName}
            bio={founderBio}
            credentials={credentials}
            linkedinUrl={linkedinUrl}
            instagramUrl={instagramUrl}
            viewTeamLabel={viewTeam}
          />
        </div>
      </div>
    </section>
  );
}