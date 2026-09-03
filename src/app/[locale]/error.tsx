"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { useLocale } from "next-intl";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-50 py-28">
        <div className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute left-1/3 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100 blur-[90px]"
          style={{ animation: "pulse-slow 7s ease-in-out infinite" }}
        />
        <div className="absolute right-1/4 bottom-1/4 h-60 w-60 rounded-full bg-primary/6 blur-[70px]"
          style={{ animation: "pulse-slow 5s ease-in-out infinite reverse" }}
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          {/* Static number */}
          <div className="mb-6 inline-block">
            <span className="font-sans text-[8rem] font-bold leading-none tracking-tighter text-primary sm:text-[11rem]"
              style={{ textShadow: "0 4px 40px rgba(10,102,74,0.2)" }}
            >
              500
            </span>
          </div>

          <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-red-300 to-transparent" />

          <p className="section-label mb-3">
            {locale === "id" ? "Kesalahan Server" : "Server Error"}
          </p>
          <h1 className="mb-5 font-sans text-2xl font-semibold text-neutral-900 sm:text-3xl">
            {locale === "id"
              ? "Terjadi kesalahan yang tidak terduga"
              : "An unexpected error occurred"}
          </h1>
          <p className="mb-10 text-neutral-500 leading-relaxed">
            {locale === "id"
              ? "Server kami mengalami masalah sementara. Tim teknis kami sedang menangani hal ini. Coba muat ulang halaman atau kembali beberapa saat lagi."
              : "Our server experienced a temporary issue. Our technical team is working on it. Please try refreshing the page or come back in a moment."}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2.5 bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600"
            >
              <RefreshCw className="h-4 w-4" />
              {locale === "id" ? "Muat Ulang" : "Try Again"}
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2.5 border border-neutral-200 bg-white px-7 py-3 text-sm font-medium text-neutral-600 transition-all hover:border-primary/30 hover:text-primary"
            >
              <Home className="h-4 w-4" />
              {locale === "id" ? "Beranda" : "Home"}
            </a>
          </div>

          {error.digest && (
            <p className="mt-10 font-mono text-[11px] text-neutral-300">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <style>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.12); }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
