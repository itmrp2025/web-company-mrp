"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Pencil, X, Save } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";

interface SeoSetting {
  id: string;
  page_slug: string;
  locale: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  robots: string;
}

interface ApiResponse<T> { success: boolean; data: T; message: string; }

interface SeoForm {
  locale: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  robots: string;
}

const emptyForm = (locale = "id"): SeoForm => ({
  locale,
  meta_title: "",
  meta_description: "",
  og_image: "",
  og_title: "",
  og_description: "",
  canonical_url: "",
  robots: "index, follow",
});

export default function AdminSeoPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<{ slug: string; locale: string } | null>(null);
  const [form, setForm] = useState<SeoForm>(emptyForm());

  const { data, isLoading } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<SeoSetting[]>>(
        getApi(endpoints.seo.adminAll)
      );
      return res.data.data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: SeoForm }) =>
      axiosInterceptor.put(getApi(endpoints.seo.adminUpdate(slug)), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-seo"] });
      toast.success("SEO diperbarui");
      setEditing(null);
    },
    onError: () => toast.error("Gagal memperbarui SEO"),
  });

  const openEdit = (seo: SeoSetting) => {
    setForm({
      locale: seo.locale,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      og_image: seo.og_image,
      og_title: seo.og_title,
      og_description: seo.og_description,
      canonical_url: seo.canonical_url,
      robots: seo.robots || "index, follow",
    });
    setEditing({ slug: seo.page_slug, locale: seo.locale });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    upsertMutation.mutate({ slug: editing.slug, payload: form });
  };

  const grouped = (data ?? []).reduce<Record<string, SeoSetting[]>>((acc, s) => {
    if (!acc[s.page_slug]) acc[s.page_slug] = [];
    acc[s.page_slug].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">SEO Settings</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Meta title, description, dan Open Graph per halaman</p>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Edit SEO: <span className="text-primary">{editing.slug}</span>{" "}
              <span className="text-neutral-400">({editing.locale.toUpperCase()})</span>
            </h2>
            <button onClick={() => setEditing(null)} className="rounded p-1 text-neutral-400 hover:text-neutral-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))}
              />
              <TextField
                label="OG Title"
                value={form.og_title}
                onChange={(e) => setForm((p) => ({ ...p, og_title: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">Meta Description</label>
              <textarea
                rows={3}
                value={form.meta_description}
                onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
                className="resize-none border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">OG Description</label>
              <textarea
                rows={3}
                value={form.og_description}
                onChange={(e) => setForm((p) => ({ ...p, og_description: e.target.value }))}
                className="resize-none border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="OG Image URL"
                value={form.og_image}
                onChange={(e) => setForm((p) => ({ ...p, og_image: e.target.value }))}
              />
              <TextField
                label="Canonical URL"
                value={form.canonical_url}
                onChange={(e) => setForm((p) => ({ ...p, canonical_url: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
              <Button
                type="submit"
                size="sm"
                startIcon={<Save className="h-4 w-4" />}
                loading={upsertMutation.isPending}
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="neutral"
                size="sm"
                onClick={() => setEditing(null)}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-400">Belum ada SEO setting</p>
            <p className="mt-1 text-xs text-neutral-300">Data akan muncul setelah halaman dikunjungi pertama kali</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Halaman</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Locale</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Meta Title</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 lg:table-cell">Meta Description</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {Object.entries(grouped).flatMap(([slug, settings]) =>
                settings.map((seo) => (
                  <tr key={`${seo.page_slug}-${seo.locale}`} className="group hover:bg-neutral-50/50">
                    <td className="px-5 py-4 font-mono text-xs text-neutral-700">/{seo.page_slug}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 uppercase">
                        {seo.locale}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <p className="line-clamp-1 text-neutral-700">{seo.meta_title || <span className="text-neutral-300">—</span>}</p>
                    </td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      <p className="line-clamp-1 text-xs text-neutral-500">{seo.meta_description || <span className="text-neutral-300">—</span>}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => openEdit(seo)}
                          className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
