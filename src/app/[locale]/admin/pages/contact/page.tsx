import { ContactPageEditor } from "@/components/admin/pages/ContactPageEditor";

export default function AdminPageContactPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Kontak</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten section halaman Contact Us</p>
      </div>
      <ContactPageEditor />
    </div>
  );
}
