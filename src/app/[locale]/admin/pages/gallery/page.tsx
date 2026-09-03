import { GalleryPageEditor } from "@/components/admin/pages/GalleryPageEditor";

export default function AdminPageGalleryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Galeri</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten section halaman Gallery</p>
      </div>
      <GalleryPageEditor />
    </div>
  );
}
