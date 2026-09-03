"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/custom-ui/Button";
import type { ApiResponse, Article } from "@/interface/admin.interface";
import dayjs from "dayjs";

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Dipublikasikan",
};

const statusColor: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  published: "bg-green-50 text-green-700",
};

export default function AdminArticlesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Article[]>>(
        getApi(endpoints.articles.adminList)
      );
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.articles.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Artikel dihapus");
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Artikel</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} artikel</p>
        </div>
        <Button href="/admin/articles/new" startIcon={<Plus className="h-4 w-4" />} size="sm">
          Tulis Artikel
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">
            Memuat...
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-400">Belum ada artikel</p>
            <Link
              href="/admin/articles/new"
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Tulis artikel pertama
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Judul
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">
                  Status
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((article) => (
                <tr key={article.id} className="group hover:bg-neutral-50/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900 line-clamp-1">
                      {article.content.title_id}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">
                      {article.content.excerpt_id}
                    </p>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusColor[article.status] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {statusLabel[article.status] ?? article.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-neutral-500 md:table-cell">
                    {article.published_at
                      ? dayjs(article.published_at).format("DD MMM YYYY")
                      : dayjs(article.created_at).format("DD MMM YYYY")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit` as Parameters<typeof Link>[0]["href"]}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.content.title_id)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
