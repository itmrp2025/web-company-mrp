import { FaqPageEditor } from "@/components/admin/pages/FaqPageEditor";

export default function AdminPageFaqPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman FAQ</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten section halaman FAQ</p>
      </div>
      <FaqPageEditor />
    </div>
  );
}
