"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { ApiResponse } from "@/interface/admin.interface";

interface GalleryItem {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
  is_visible: boolean;
  content: Record<string, string>;
}

const CATEGORIES = ["litigation", "consultation", "training", "award", "community", "general"];

export function GalleryManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    image_url: "",
    category: "general",
    title_id: "",
    title_en: "",
    desc_id: "",
    desc_en: "",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<GalleryItem[]>>(getApi("/admin/gallery"));
      return res.data.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      axiosInterceptor.post(getApi("/admin/gallery"), {
        image_url: data.image_url,
        category: data.category,
        is_visible: true,
        content: {
          title_id: data.title_id,
          title_en: data.title_en,
          desc_id: data.desc_id,
          desc_en: data.desc_en,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Foto ditambahkan");
      setShowForm(false);
      setForm({ image_url: "", category: "general", title_id: "", title_en: "", desc_id: "", desc_en: "" });
    },
    onError: () => toast.error("Gagal menambahkan foto"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInterceptor.delete(getApi(`/admin/gallery/${id}`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Foto dihapus");
    },
    onError: () => toast.error("Gagal menghapus foto"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_visible }: { id: string; is_visible: boolean }) =>
      axiosInterceptor.put(getApi(`/admin/gallery/${id}`), { is_visible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
    onError: () => toast.error("Gagal mengubah visibilitas"),
  });

  if (isLoading) return <div className="py-20 text-center text-sm text-neutral-400">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} foto</p>
        <Button size="sm" startIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowForm((v) => !v)}>
          Tambah Foto
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-neutral-100 bg-white p-6 space-y-4">
          <p className="text-sm font-semibold text-neutral-900">Foto Baru</p>
          <ImageUpload
            label="Foto"
            folder="gallery"
            value={form.image_url}
            onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <TextField label="Judul (Indonesia)" value={form.title_id} onChange={(e) => setForm((p) => ({ ...p, title_id: e.target.value }))} />
            <TextField label="Title (English)" value={form.title_en} onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))} />
            <TextField label="Deskripsi (Indonesia)" value={form.desc_id} onChange={(e) => setForm((p) => ({ ...p, desc_id: e.target.value }))} />
            <TextField label="Description (English)" value={form.desc_en} onChange={(e) => setForm((p) => ({ ...p, desc_en: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.image_url || createMutation.isPending}>
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button color="neutral" onClick={() => setShowForm(false)}>Batal</Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-neutral-100 bg-white p-12 text-center text-sm text-neutral-400">
          Belum ada foto. Klik &quot;Tambah Foto&quot; untuk mulai.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className={`group relative rounded-lg overflow-hidden border ${item.is_visible ? "border-neutral-100" : "border-neutral-200 opacity-50"}`}>
              <div className="relative aspect-square bg-neutral-100">
                {item.image_url && (
                  <Image src={item.image_url} alt="" fill unoptimized className="object-cover" sizes="200px" />
                )}
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-neutral-400 uppercase">{item.category}</p>
                <p className="text-xs text-neutral-700 truncate">{item.content.title_id || "—"}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleMutation.mutate({ id: item.id, is_visible: !item.is_visible })}
                  className="h-7 w-7 rounded bg-white shadow flex items-center justify-center hover:bg-neutral-50"
                >
                  {item.is_visible ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5 text-neutral-400" />}
                </button>
                <button
                  onClick={() => { if (confirm("Hapus foto ini?")) deleteMutation.mutate(item.id); }}
                  className="h-7 w-7 rounded bg-white shadow flex items-center justify-center hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
