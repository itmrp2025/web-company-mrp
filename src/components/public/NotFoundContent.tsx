import { Link } from "@/i18n/navigation";
import { Home, Phone } from "lucide-react";

export function NotFoundContent({ locale }: { locale: string }) {
  const isId = locale === "id";

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-50 py-28">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="animate-pulse-slow absolute left-1/4 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[80px]" />
      <div className="animate-pulse-slower absolute right-1/4 bottom-1/3 h-56 w-56 rounded-full bg-accent/8 blur-[60px]" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <div className="mb-6 inline-block">
          <span
            className="font-sans text-[8rem] font-bold leading-none tracking-tighter text-primary sm:text-[11rem]"
            style={{ textShadow: "0 4px 40px rgba(10,102,74,0.2)" }}
          >
            404
          </span>
        </div>

        <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <p className="section-label mb-3">
          {isId ? "Halaman Tidak Ditemukan" : "Page Not Found"}
        </p>
        <h1 className="mb-5 font-sans text-2xl font-semibold text-neutral-900 sm:text-3xl">
          {isId ? "Sepertinya halaman ini tidak ada" : "This page doesn't seem to exist"}
        </h1>
        <p className="mb-10 leading-relaxed text-neutral-500">
          {isId
            ? "URL yang Anda akses tidak ditemukan atau telah dipindahkan. Silakan kembali ke beranda atau hubungi kami jika membutuhkan bantuan."
            : "The URL you accessed was not found or may have been moved. Please return to the homepage or contact us if you need assistance."}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600"
          >
            <Home className="h-4 w-4" />
            {isId ? "Kembali ke Beranda" : "Back to Home"}
          </Link>
          <a
            href="tel:+622150300825"
            className="inline-flex items-center gap-2.5 border border-neutral-200 bg-white px-7 py-3 text-sm font-medium text-neutral-600 transition-all hover:border-primary/30 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {isId ? "Hubungi Kami" : "Contact Us"}
          </a>
        </div>
      </div>
    </main>
  );
}
