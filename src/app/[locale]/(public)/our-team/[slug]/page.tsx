import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Award,
  Scale,
  BookOpen,
  MapPin,
} from "lucide-react";
import { serverFetch } from "@/utils/helpers/serverFetch";
import { buildMetadata } from "@/utils/helpers/seo";
import type { TeamMember } from "@/interface/admin.interface";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const members = (await serverFetch<TeamMember[]>("/team")) ?? [];
  const member = members.find((m) => m.slug === slug);
  if (!member) {
    return buildMetadata({
      slug: "team",
      locale,
      path: "/our-team",
      fallback: {
        title: "Our Team - MRP Law Office",
        description: "MRP Law Office Team",
      },
    });
  }

  const name =
    locale === "id" ? member.content.name_id : member.content.name_en;
  return buildMetadata({
    slug: "team",
    locale,
    path: `/our-team/${slug}`,
    fallback: {
      title: `${name} - MRP Law Office`,
      description:
        locale === "id"
          ? `Profil ${name} - MRP Law Office`
          : `${name} Profile - MRP Law Office`,
    },
  });
}

export default async function LawyerProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  const lang = locale as "id" | "en";
  const t = await getTranslations({ locale, namespace: "team" });

  const members = (await serverFetch<TeamMember[]>("/team")) ?? [];
  const member = members.find((m) => m.slug === slug);

  if (!member) notFound();

  const name = lang === "id" ? member.content.name_id : member.content.name_en;
  const title =
    lang === "id" ? member.content.title_id : member.content.title_en;
  const bio = lang === "id" ? member.content.bio_id : member.content.bio_en;
  const specializations = member.content.specializations ?? [];
  const isFounder = member.role_type === "founder";

  const roleBadge = isFounder
    ? t("founder_badge")
    : member.role_type.charAt(0).toUpperCase() + member.role_type.slice(1);

  return (
    <>
      {/* Unified Hero Section (Dark Background) */}
      <section className="relative bg-neutral-950 text-white py-14 sm:py-18 lg:py-20 border-b border-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900/90 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto KIRI */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-2xl">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={name}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 280px, 320px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                    <span className="font-sans text-7xl font-bold text-neutral-600">
                      {name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info KANAN */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col items-start">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-300 text-xs font-semibold tracking-wider uppercase rounded-full border border-primary/30">
                  {isFounder ? (
                    <Award className="h-3.5 w-3.5" />
                  ) : (
                    <Scale className="h-3.5 w-3.5" />
                  )}
                  {roleBadge}
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                {name}
              </h1>
              <p className="text-lg sm:text-xl text-primary-400 font-medium mb-6">
                {title}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-neutral-300 mb-8 pb-6 border-b border-neutral-800 w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>Jakarta, Indonesia</span>
                </div>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                    <span>{member.email}</span>
                  </a>
                )}
              </div>

              {/* Social links */}
              {(member.linkedin_url || member.instagram_url) && (
                <div className="flex flex-wrap gap-3">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/90 px-4 py-2 text-xs font-medium text-neutral-300 hover:border-primary-400 hover:text-white transition-colors rounded-lg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/90 px-4 py-2 text-xs font-medium text-neutral-300 hover:border-primary-400 hover:text-white transition-colors rounded-lg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Konten (Background Putih) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* OVERVIEW Section */}
          <div className="max-w-4xl">
            <h2 className="font-sans text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {t("overview") ?? (lang === "id" ? "Ringkasan" : "Overview")}
            </h2>
            <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed text-base">
              <p className="whitespace-pre-line">{bio}</p>
            </div>
          </div>

          {/* Specializations */}
          {specializations.length > 0 && (
            <div className="mt-14 max-w-4xl border-t border-neutral-100 pt-10">
              <h3 className="font-sans text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {t("specializations") ??
                  (lang === "id" ? "Spesialisasi" : "Specializations")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center px-3.5 py-1.5 bg-primary/8 border border-primary/15 text-sm font-medium text-primary rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Team */}
          <div className="mt-14 pt-8 border-t border-neutral-200">
            <Link
              href="/our-team"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back_to_team") ??
                (lang === "id" ? "Kembali ke Tim" : "Back to Team")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}