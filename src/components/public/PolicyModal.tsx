"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import { X, ExternalLink, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";

interface PolicyModalProps {
  slug: "privacy-policy" | "terms-conditions";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree?: () => void;
}

interface SectionData {
  id: string;
  section_key: string;
  content: Record<string, string>;
}

// Static fallback content if CMS sections are not yet populated
const fallbackContent = {
  "privacy-policy": {
    id: {
      title: "Kebijakan Privasi",
      sub: "MRP Law Office menghargai privasi dan perlindungan data pribadi Anda.",
      sections: [
        {
          heading: "1. Pendahuluan",
          body: "MRP Law Office (\"Kami\") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan website kami.",
        },
        {
          heading: "2. Informasi yang Kami Kumpulkan",
          body: "Kami dapat mengumpulkan informasi identitas (nama, email, nomor telepon), data formulir kontak/lamaran, data teknis (IP address, jenis browser), dan informasi ulasan.",
        },
        {
          heading: "3. Penggunaan Informasi",
          body: "Informasi digunakan untuk merespons konsultasi, memproses lamaran kerja, meningkatkan layanan website, dan memenuhi kewajiban hukum yang berlaku.",
        },
        {
          heading: "4. Perlindungan Data & Hak Anda",
          body: "Kami menerapkan keamanan teknis sesuai UU Perlindungan Data Pribadi (UU PDP). Anda berhak mengakses, mengoreksi, atau meminta penghapusan data Anda melalui info@mrplawoffice.com.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      sub: "MRP Law Office respects your privacy and personal data protection.",
      sections: [
        {
          heading: "1. Introduction",
          body: "MRP Law Office (\"We\") values your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when using our website.",
        },
        {
          heading: "2. Information We Collect",
          body: "We may collect identity information (name, email, phone number), form/application data, technical data (IP address, browser type), and review submissions.",
        },
        {
          heading: "3. Use of Information",
          body: "Information is used to respond to inquiries, process job applications, improve website services, and comply with legal obligations.",
        },
        {
          heading: "4. Data Protection & Your Rights",
          body: "We apply technical security in compliance with PDP Law. You have the right to access, correct, or request deletion of your data via info@mrplawoffice.com.",
        },
      ],
    },
  },
  "terms-conditions": {
    id: {
      title: "Syarat & Ketentuan",
      sub: "Ketentuan penggunaan website dan layanan informasi MRP Law Office.",
      sections: [
        {
          heading: "1. Penerimaan Ketentuan",
          body: "Dengan menggunakan website mrplawoffice.com, Anda menyetujui Syarat & Ketentuan ini. Jika tidak setuju, mohon untuk tidak melanjutkan penggunaan website.",
        },
        {
          heading: "2. Bukan Nasihat Hukum",
          body: "Konten website ini bersifat informasi umum dan bukan nasihat hukum resmi. Tidak menciptakan hubungan pengacara-klien tanpa perjanjian tertulis.",
        },
        {
          heading: "3. Hak Kekayaan Intelektual",
          body: "Seluruh teks, logo, desain, dan konten di website ini merupakan hak cipta MRP Law Office. Dilarang menyalin tanpa izin tertulis.",
        },
        {
          heading: "4. Hukum yang Berlaku",
          body: "Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia. Penyelesaian sengketa dilakukan di pengadilan berwenang di Jakarta.",
        },
      ],
    },
    en: {
      title: "Terms & Conditions",
      sub: "Terms governing the use of MRP Law Office website and information services.",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By using mrplawoffice.com, you agree to these Terms & Conditions. If you do not agree, please refrain from using the website.",
        },
        {
          heading: "2. Not Legal Advice",
          body: "Website content is for general information only and does not constitute formal legal advice or an attorney-client relationship.",
        },
        {
          heading: "3. Intellectual Property",
          body: "All text, logos, designs, and content are intellectual property of MRP Law Office. Copying without permission is prohibited.",
        },
        {
          heading: "4. Governing Law",
          body: "These terms are governed by the laws of the Republic of Indonesia. Disputes shall be settled in competent courts in Jakarta.",
        },
      ],
    },
  },
};

export function PolicyModal({
  slug,
  open,
  onOpenChange,
  onAgree,
}: PolicyModalProps) {
  const locale = useLocale();
  const lang = (locale === "en" ? "en" : "id") as "id" | "en";
  const backdropRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    setLoading(true);
    setError(false);

    fetch(getApi(endpoints.cms.pageSections(slug)))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.sections && Array.isArray(data.data.sections)) {
          setSections(data.data.sections);
        } else {
          setSections([]);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, slug, onOpenChange]);

  if (!open) return null;

  const title =
    slug === "privacy-policy"
      ? lang === "id"
        ? "Kebijakan Privasi"
        : "Privacy Policy"
      : lang === "id"
      ? "Syarat & Ketentuan"
      : "Terms & Conditions";

  const pagePath = slug === "privacy-policy" ? "/privacy-policy" : "/terms-conditions";
  const fallback = fallbackContent[slug][lang];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === backdropRef.current) onOpenChange(false);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />

      {/* Container */}
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {slug === "privacy-policy" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="font-sans text-lg font-semibold text-neutral-900">
                {title}
              </h2>
              <p className="text-xs text-neutral-400">
                MRP Law Office Legal Documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-neutral-600 space-y-6 max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-neutral-400">
                {lang === "id" ? "Memuat dokumen..." : "Loading document..."}
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-amber-50 p-4 text-xs text-amber-800 border border-amber-200">
              <p className="font-medium mb-1">
                {lang === "id"
                  ? "Gagal memuat konten dari CMS server."
                  : "Failed to load content from CMS server."}
              </p>
              <p>{lang === "id" ? "Menampilkan ringkasan ketentuan standar firma." : "Displaying summary of firm terms."}</p>
            </div>
          ) : null}

          {!loading && (
            <>
              {sections.length > 0 ? (
                sections.map((sec) => {
                  const headingText =
                    sec.content[`heading_${lang}`] ||
                    sec.content[`title_${lang}`] ||
                    sec.section_key;
                  const bodyText =
                    sec.content[`body_${lang}`] ||
                    sec.content[`content_${lang}`] ||
                    sec.content[`description_${lang}`] ||
                    "";

                  return (
                    <div key={sec.id || sec.section_key} className="space-y-2">
                      <h3 className="font-semibold text-neutral-900">
                        {headingText}
                      </h3>
                      <div className="whitespace-pre-line text-neutral-600 leading-relaxed">
                        {bodyText}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Display default fallback sections */
                <div className="space-y-5">
                  <p className="text-xs italic text-neutral-400 border-b border-neutral-100 pb-2">
                    {fallback.sub}
                  </p>
                  {fallback.sections.map((sec, i) => (
                    <div key={i} className="space-y-1.5">
                      <h3 className="font-medium text-neutral-900 text-sm">
                        {sec.heading}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm">
                        {sec.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4 bg-neutral-50 rounded-b-2xl">
          <a
            href={pagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {lang === "id"
              ? "Baca versi lengkap di tab baru"
              : "Read full version in new tab"}
            <ExternalLink className="h-3 w-3" />
          </a>

          <div className="flex items-center gap-2 shrink-0">
            {onAgree && (
              <Button
                size="sm"
                onClick={() => {
                  onAgree();
                  onOpenChange(false);
                }}
              >
                {lang === "id" ? "Saya Setuju" : "I Agree"}
              </Button>
            )}
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {lang === "id" ? "Tutup" : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
