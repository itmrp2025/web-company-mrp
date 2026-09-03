import { GalleryManager } from "@/components/admin/gallery/GalleryManager";

export default function AdminGalleryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Galeri Foto</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola foto galeri yang tampil di halaman publik</p>
      </div>
      <GalleryManager />
    </div>
  );
}
