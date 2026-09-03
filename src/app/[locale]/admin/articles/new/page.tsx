"use client";

import { useRouter } from "@/i18n/navigation";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";

export default function NewArticlePage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Tulis Artikel</h1>
      </div>
      <ArticleForm onSuccess={() => router.push("/admin/articles")} />
    </div>
  );
}
