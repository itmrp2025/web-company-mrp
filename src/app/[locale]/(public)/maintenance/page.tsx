"use client";

import { useLocale } from "next-intl";
import { Wrench, Clock, Phone, Mail } from "lucide-react";

export default function MaintenancePage() {
  const locale = useLocale();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient glows */}
      <div className="absolute left-1/3 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]"
        style={{ animation: "pulse-slow 7s ease-in-out infinite" }}
      />
      <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/8 blur-[80px]"
        style={{ animation: "pulse-slow 5s ease-in-out infinite reverse" }}
      />

      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-primary">
            <span className="font-sans text-xs font-bold text-white">MRP</span>
          </div>
          <div className="text-left leading-none">
            <p className="font-sans text-base font-semibold text-neutral-900">MRP Law Office</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Advocates & Consultants</p>
          </div>
        </div>

        {/* Icon */}
        <div className="mb-8 flex justify-center"
          style={{ animation: "float 3.5s ease-in-out infinite" }}
        >
          <div className="relative">
            <div className="rounded-full border border-primary/15 bg-primary/5 p-6"
              style={{ animation: "ring-pulse 3s ease-in-out infinite" }}
            >
              <Wrench className="h-12 w-12 text-primary" />
            </div>
            {/* Orbiting dot */}
            <div className="absolute inset-0"
              style={{ animation: "orbit 4s linear infinite" }}
            >
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-sm" />
            </div>
          </div>
        </div>

        <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <p className="section-label mb-3">
          {locale === "id" ? "Sedang Dalam Pemeliharaan" : "Under Maintenance"}
        </p>
        <h1 className="mb-5 font-sans text-2xl font-semibold text-neutral-900 sm:text-3xl">
          {locale === "id"
            ? "Website sedang dalam perbaikan"
            : "We're improving our website"}
        </h1>
        <p className="mb-10 text-neutral-500 leading-relaxed">
          {locale === "id"
            ? "Kami sedang melakukan pembaruan sistem untuk memberikan pengalaman yang lebih baik. Kami akan segera kembali online. Terima kasih atas kesabaran Anda."
            : "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly. Thank you for your patience."}
        </p>

        {/* ETA chip */}
        <div className="mb-10 inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm text-neutral-600">
            {locale === "id" ? "Estimasi selesai: beberapa jam ke depan" : "Estimated completion: a few hours"}
          </span>
        </div>

        {/* Contact strip */}
        <div className="border-t border-neutral-100 pt-8">
          <p className="mb-4 text-xs uppercase tracking-wider text-neutral-400">
            {locale === "id" ? "Butuh bantuan mendesak?" : "Need urgent assistance?"}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+622150300825"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              (+62) 21 50300825
            </a>
            <span className="hidden h-3 w-px bg-neutral-200 sm:block" />
            <a
              href="mailto:info@mrplawoffice.com"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              info@mrplawoffice.com
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10,102,74,0.12); }
          50% { box-shadow: 0 0 0 20px rgba(10,102,74,0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
