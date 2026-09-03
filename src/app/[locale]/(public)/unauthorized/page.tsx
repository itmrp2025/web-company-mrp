"use client";

import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const locale = useLocale();

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

        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 blur-[100px]"
          style={{ animation: "pulse-slow 6s ease-in-out infinite" }}
        />
        <div className="absolute right-1/3 bottom-1/4 h-52 w-52 rounded-full bg-primary/6 blur-[60px]"
          style={{ animation: "pulse-slow 9s ease-in-out infinite reverse" }}
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          {/* Static number */}
          <div className="mb-4 inline-block">
            <span className="font-sans text-[8rem] font-bold leading-none tracking-tighter text-primary sm:text-[11rem]"
              style={{ textShadow: "0 4px 40px rgba(10,102,74,0.2)" }}
            >
              401
            </span>
          </div>

          {/* Animated icon below number */}
          <div className="mb-8 flex justify-center"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <div className="rounded-full border border-amber-200 bg-amber-50 p-4"
              style={{ animation: "ring-pulse 2.5s ease-in-out infinite" }}
            >
              <ShieldX className="h-9 w-9 text-amber-500" />
            </div>
          </div>

          <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

          <p className="section-label mb-3">
            {locale === "id" ? "Akses Dibatasi" : "Access Restricted"}
          </p>
          <h1 className="mb-5 font-sans text-2xl font-semibold text-neutral-900 sm:text-3xl">
            {locale === "id"
              ? "Anda tidak memiliki akses ke halaman ini"
              : "You don't have access to this page"}
          </h1>
          <p className="mb-10 text-neutral-500 leading-relaxed">
            {locale === "id"
              ? "Halaman ini memerlukan autentikasi atau izin khusus. Silakan login atau hubungi administrator untuk mendapatkan akses."
              : "This page requires authentication or special permissions. Please log in or contact the administrator to gain access."}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600"
            >
              <Home className="h-4 w-4" />
              {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2.5 border border-neutral-200 bg-white px-7 py-3 text-sm font-medium text-neutral-600 transition-all hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "id" ? "Halaman Sebelumnya" : "Go Back"}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.12); }
          }
          @keyframes ring-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.2); }
            50% { box-shadow: 0 0 0 16px rgba(245,158,11,0); }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
