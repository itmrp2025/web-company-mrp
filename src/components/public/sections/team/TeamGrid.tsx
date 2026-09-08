"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ExternalLink, Mail } from "lucide-react";

export interface Attorney {
  id: string;
  name: string;
  title: string;
  roleType: "founder" | "associate";
  photo: string;
  bio: { id: string; en: string };
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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
        >
          <X className="h-4 w-4 text-neutral-500" />
        </button>

        <div className="p-6 sm:p-8">
          {attorney.roleType === "founder" && (
            <span className="inline-block mb-3 text-[10px] font-semibold tracking-widest uppercase text-primary">
              {labels.founderBadge}
            </span>
          )}
          <h2 className="font-sans text-lg font-semibold text-neutral-900 leading-snug pr-8">
            {attorney.name}
          </h2>
          <p className="mt-1 text-sm text-primary font-medium">{attorney.title}</p>

          <p className="mt-5 text-sm text-neutral-600 leading-relaxed">
            {attorney.bio[locale]}
          </p>

          {attorney.credentials.length > 0 && (
            <ul className="mt-5 space-y-1 bg-neutral-50 rounded-lg p-4">
              {attorney.credentials.map((c) => (
                <li key={c} className="text-xs text-neutral-500">{c}</li>
              ))}
            </ul>
          )}

          {attorney.specializations.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {attorney.specializations.map((s) => (
                <span
                  key={s}
                  className="bg-primary/6 border border-primary/12 px-2.5 py-0.5 text-[10px] font-medium text-primary rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {(attorney.linkedin || attorney.email || attorney.instagram) && (
            <div className="mt-6 flex flex-wrap gap-4">
              {attorney.linkedin && (
                <a
                  href={attorney.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
              {attorney.email && (
                <a
                  href={`mailto:${attorney.email}`}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> {attorney.email}
                </a>
              )}
              {attorney.instagram && (
                <a
                  href={attorney.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className="relative overflow-hidden aspect-[3/4]">
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
