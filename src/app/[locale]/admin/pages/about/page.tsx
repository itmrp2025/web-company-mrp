import { AboutPageEditor } from "@/components/admin/pages/AboutPageEditor";

export default function AdminPageAboutPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Tentang Kami</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Kelola konten tiap section halaman About
        </p>
      </div>
      <AboutPageEditor />
    </div>
  );
}
