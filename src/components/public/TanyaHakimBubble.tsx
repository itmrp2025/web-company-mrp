"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

const TANYA_HAKIM_URL = "https://tanyahakim.com";
const FALLBACK_TIMEOUT = 4000;

export function TanyaHakimBubble() {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      loadedRef.current = false;
      timeoutRef.current = setTimeout(() => {
        if (!loadedRef.current) {
          setShowFallback(true);
        }
      }, FALLBACK_TIMEOUT);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleIframeLoad = () => {
    loadedRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const toggleBubble = () => {
    if (!isOpen) {
      setShowFallback(false);
    }
    setIsOpen(!isOpen);
  };

  const closeBubble = () => {
    setIsOpen(false);
  };

  const handleFallbackClick = () => {
    window.open(TANYA_HAKIM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <button
        onClick={toggleBubble}
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
                onClick={closeBubble}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                aria-label={t("close") ?? "Tutup"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body - Iframe or Fallback */}
            <div className="flex-1 relative overflow-hidden">
              {!showFallback ? (
                <iframe
                  src={TANYA_HAKIM_URL}
                  title="Tanya Hakim"
                  className="absolute inset-0 w-full h-full border-0 bg-white"
                  allow="clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  onLoad={handleIframeLoad}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center bg-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-neutral-900">
                      {t("tanya_hakim_fallback_title") ?? "Tidak bisa memuat chat di sini"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {t("tanya_hakim_fallback_desc") ?? "Platform Tanya Hakim tidak mengizinkan tampilan dalam iframe."}
                    </p>
                  </div>
                  <button
                    onClick={handleFallbackClick}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("tanya_hakim_fallback_button") ?? "Buka Tanya Hakim di Tab Baru"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}