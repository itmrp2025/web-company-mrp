import { HomePageEditor } from "@/components/admin/pages/HomePageEditor";

export default function AdminPageHomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Home</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Kelola konten tiap section halaman beranda
        </p>
      </div>
      <HomePageEditor />
    </div>
  );
}
