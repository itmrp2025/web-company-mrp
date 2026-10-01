"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ExternalLink, Mail, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export interface Attorney {
  id: string;
  slug: string;
  name: string;
  title: string;
  roleType: "founder" | "associate";
  photo: string;
  bio: { id: string; en: string };
  summary?: { id: string; en: string };
  credentials: string[];
  specializations: string[];
  linkedin?: string;
  instagram?: string;
  email?: string;
}

interface Labels {
  founderLabel: string;
  associatesLabel: string;
  viewProfileLabel: string;
  founderBadge: string;
}

const stripHtml = (s: string) =>
  s.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function Modal({
  attorney,
  locale,
  labels,
  onClose,
}: {
  attorney: Attorney;
  locale: "id" | "en";
  labels: Labels;
  onClose: () => void;
}) {
  const t = useTranslations("team");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Ringkasan dari admin; kalau kosong, potong dari bio
  const summary = attorney.summary?.[locale]?.trim();
  const bioText = stripHtml(attorney.bio[locale] ?? "");
  const fallback = bioText.length > 320 ? bioText.slice(0, 320).trimEnd() + "…" : bioText;

  const hasLinks = attorney.linkedin || attorney.instagram || attorney.email;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/70 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow transition-colors hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        
        <div className="bg-primary px-6 py-5 pr-16 sm:px-8 sm:py-7">
          {attorney.roleType === "founder" && (
            <span className="inline-block rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              {labels.founderBadge}
            </span>
          )}
          <h2 className="mt-2 font-sans text-lg font-semibold leading-snug text-white sm:text-xl">
            {attorney.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-white/80">{attorney.title}</p>
        </div>
        {/* Isi: ringkasan (scroll kalau panjang) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                   <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {summary || fallback}
          </p>

          {attorney.credentials.length > 0 && (
            <ul className="mt-5 space-y-1 rounded-lg bg-neutral-50 p-4">
              {attorney.credentials.map((c) => (
                <li key={c} className="text-xs text-neutral-500">{c}</li>
              ))}
            </ul>
          )}

          {attorney.specializations.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {attorney.specializations.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: kontak + CTA, selalu terlihat */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {hasLinks && (
              <>
                {attorney.email && (
                  <a
                    href={`mailto:${attorney.email}`}
                    aria-label="Email"
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {attorney.linkedin && (
                  <a
                    href={attorney.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 transition-colors hover:border-primary hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
                {attorney.instagram && (
                  <a
                    href={attorney.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 transition-colors hover:border-primary hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Instagram
                  </a>
                )}
              </>
            )}
          </div>

          <Link
            href={`/our-team/${attorney.slug}`}
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            {t("full_profile")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ===== AttorneyCard dan TeamGrid: TIDAK BERUBAH dari file kamu ===== */
function AttorneyCard({
  attorney,
  labels,
  onClick,
}: {
  attorney: Attorney;
  labels: Labels;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left overflow-hidden rounded-xl bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
    >
      <div className="relative overflow-hidden aspect-3/4">
        {attorney.photo ? (
          <Image
            src={attorney.photo}
            alt={attorney.name}
            fill
            unoptimized
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100 flex items-center justify-center">
            <span className="text-4xl font-semibold text-neutral-300">
              {attorney.name?.charAt(0) ?? "?"}
            </span>
          </div>
        )}
        {attorney.roleType === "founder" && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
            {labels.founderBadge}
          </div>
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-primary text-xs font-semibold px-4 py-2 rounded-full shadow-md">
            {labels.viewProfileLabel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-sans text-sm font-semibold text-neutral-900 leading-snug">
          {attorney.name}
        </h3>
        <p className="mt-1 text-xs text-primary font-medium">{attorney.title}</p>
        {attorney.specializations.length > 0 && (
          <p className="mt-2 text-[10px] text-neutral-400 truncate">
            {attorney.specializations.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </button>
  );
}

interface Props {
  attorneys: Attorney[];
  labels: Labels;
  locale: "id" | "en";
}

export function TeamGrid({ attorneys, labels, locale }: Props) {
  const [selected, setSelected] = useState<Attorney | null>(null);

  const founders = attorneys.filter((a) => a.roleType === "founder");
  const associates = attorneys.filter((a) => a.roleType === "associate");

  return (
    <>
      {founders.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-10 text-center">{labels.founderLabel}</p>
            <div className="flex flex-wrap justify-center gap-5">
              {founders.map((a) => (
                <div key={a.id} className="w-full max-w-xs sm:max-w-sm">
                  <AttorneyCard attorney={a} labels={labels} onClick={() => setSelected(a)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {associates.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-10">{labels.associatesLabel}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {associates.map((a) => (
                <AttorneyCard key={a.id} attorney={a} labels={labels} onClick={() => setSelected(a)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {selected && (
        <Modal
          attorney={selected}
          locale={locale}
          labels={labels}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
