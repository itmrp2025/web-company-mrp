"use client";

import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { Avatar } from "@/components/custom-ui/Avatar";
import { cn } from "@/lib/utils";

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  specs: string[];
  socials?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
  socialsLabel?: string;
  viewProfileLabel?: string;
}

export function TeamMemberModal({ member, onClose, socialsLabel = "Sosial Media" }: TeamMemberModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [member, onClose]);

  if (!member) return null;

  const socials = [
    { key: "linkedin", label: "LinkedIn", href: member.socials?.linkedin },
    { key: "instagram", label: "Instagram", href: member.socials?.instagram },
    { key: "twitter", label: "X / Twitter", href: member.socials?.twitter },
    { key: "website", label: "Website", href: member.socials?.website },
  ].filter((s) => s.href);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md bg-white shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          "sm:rounded-none" // square corners
        )}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center bg-neutral-900/80 text-white hover:bg-neutral-900 transition-colors"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Photo area */}
        <div className="relative bg-neutral-100 flex items-center justify-center" style={{ minHeight: 280 }}>
          <div className="flex flex-col items-center justify-center py-12 px-8">
            <Avatar
              fallback={member.name}
              size="xl"
              className="h-32 w-32 text-4xl border-4 border-white shadow-lg"
            />
          </div>
          {/* Role badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 px-6 py-2">
            <p className="section-label text-neutral-400">{member.role}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-5">
          <h2 className="font-sans text-2xl font-semibold text-neutral-900">{member.name}</h2>
          <p className="mt-0.5 text-sm text-neutral-400">{member.title}</p>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-600 leading-relaxed">{member.bio}</p>
          </div>

          {/* Specs */}
          {member.specs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {member.specs.map((spec) => (
                <span
                  key={spec}
                  className="border border-neutral-200 px-3 py-1 text-xs text-neutral-500"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <p className="section-label mb-3">{socialsLabel}</p>
              <div className="flex flex-wrap gap-3">
                {socials.map(({ key, label, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:border-primary hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

