import { CareerPageEditor } from "@/components/admin/pages/CareerPageEditor";

export default function AdminPageCareerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Karir</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten section halaman Career</p>
      </div>
      <CareerPageEditor />
    </div>
  );
}
