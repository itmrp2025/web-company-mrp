import { Link } from "@/i18n/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="font-sans text-[6rem] font-bold leading-none tracking-tighter text-neutral-100">
        404
      </span>
      <div className="mx-auto mb-6 mt-2 h-px w-12 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
        Halaman Tidak Ditemukan
      </p>
      <h1 className="mb-3 font-sans text-xl font-semibold text-neutral-900">
        Halaman yang Anda cari tidak tersedia
      </h1>
      <p className="mb-8 max-w-sm text-sm text-neutral-500">
        URL tidak valid atau halaman telah dipindahkan. Kembali ke dashboard untuk melanjutkan.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>
    </div>
  );
}
