import { ServicesPageEditor } from "@/components/admin/pages/ServicesPageEditor";

export default function AdminPageServicesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Layanan</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Kelola konten tiap section halaman Services
        </p>
      </div>
      <ServicesPageEditor />
    </div>
  );
}
