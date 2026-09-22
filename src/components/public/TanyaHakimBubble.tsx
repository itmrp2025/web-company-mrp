"use client";

import { useState } from "react";
import { X, MessageCircle, Scale, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

const TANYA_HAKIM_URL = "https://tanyahakim.com";

export function TanyaHakimBubble() {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-all duration-300 hover:bg-primary-600 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-950"
        aria-label="Buka Tanya Hakim"
        aria-expanded={isOpen}
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Popup Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 z-50 animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="Tanya Hakim"
        >
          <div className="relative flex h-[520px] w-[360px] max-h-[calc(100vh-8rem)] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:h-[560px] sm:w-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 bg-white rounded-t-2xl shrink-0">
              <h2 className="font-sans text-base font-semibold text-neutral-900">
                {t("tanya_hakim_title") ?? "Tanya Hakim"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                aria-label={t("close") ?? "Tutup"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body - Teaser Card */}
            <div className="flex flex-1 flex-col items-center justify-between p-6 text-center bg-white">
              <div className="my-auto flex flex-col items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Scale className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-neutral-900">
                    {t("tanya_hakim_title") ?? "Tanya Hakim"}
                  </h3>
                  <p className="max-w-[280px] text-sm leading-relaxed text-neutral-500">
                    {t("tanya_hakim_desc") ??
                      "Punya pertanyaan hukum cepat? Chat langsung dengan Tanya Hakim, platform tanya-jawab hukum terpercaya."}
                  </p>
                </div>
              </div>

              <a
                href={TANYA_HAKIM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span>{t("tanya_hakim_cta_button") ?? "Buka Tanya Hakim"}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
