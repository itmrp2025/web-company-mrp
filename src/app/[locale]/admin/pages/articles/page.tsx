import { ArticlesPageEditor } from "@/components/admin/pages/ArticlesPageEditor";

export default function AdminPageArticlesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Artikel</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten section halaman Artikel</p>
      </div>
      <ArticlesPageEditor />
    </div>
  );
}
