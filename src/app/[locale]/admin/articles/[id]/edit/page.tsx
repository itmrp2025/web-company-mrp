"use client";

import { use } from "react";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";
import type { ApiResponse, Article } from "@/interface/admin.interface";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: article, isLoading } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Article>>(
        getApi(endpoints.articles.adminList + `/${id}`)
      );
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
        Memuat...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Edit Artikel</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{article?.content.title_id}</p>
      </div>
      <ArticleForm article={article} onSuccess={() => router.push("/admin/articles")} />
    </div>
  );
}
