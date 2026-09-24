"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, Tag } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { ApiResponse } from "@/interface/admin.interface";

interface GalleryCategory {
  id: string;
  name: string;
}

interface GalleryItem {
  id: string;
  category_id: string;
  image_url: string;
  order_index: number;
  is_visible: boolean;
  content: Record<string, string>;
}

const DEFAULT_FORM = {
  image_url: "",
  category_id: "",
  title_id: "",
  title_en: "",
  desc_id: "",
  desc_en: "",
};

type FormState = typeof DEFAULT_FORM;

export function GalleryManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<GalleryItem[]>>(getApi("/admin/gallery"));
      return res.data.data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-gallery-categories"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<GalleryCategory[]>>(getApi("/admin/gallery-categories"));
      return res.data.data ?? [];
    },
  });

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  function resetForm() {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  function openCreateForm() {
    setForm({ ...DEFAULT_FORM, category_id: categories[0]?.id ?? "" });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(item: GalleryItem) {
    setForm({
      image_url: item.image_url,
      category_id: item.category_id,
      title_id: item.content.title_id ?? "",
      title_en: item.content.title_en ?? "",
      desc_id: item.content.desc_id ?? "",
      desc_en: item.content.desc_en ?? "",
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function buildPayload(data: FormState) {
    return {
      image_url: data.image_url,
      category_id: data.category_id,
      content: {
        title_id: data.title_id,
        title_en: data.title_en,
        desc_id: data.desc_id,
        desc_en: data.desc_en,
      },
    };
  }

  const createMutation = useMutation({
    mutationFn: (data: FormState) =>
      axiosInterceptor.post(getApi("/admin/gallery"), {
        ...buildPayload(data),
        is_visible: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Foto ditambahkan");
      resetForm();
    },
    onError: () => toast.error("Gagal menambahkan foto"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormState }) =>
      axiosInterceptor.put(getApi(`/admin/gallery/${id}`), buildPayload(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Foto diperbarui");
      resetForm();
    },
    onError: () => toast.error("Gagal memperbarui foto"),
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

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => axiosInterceptor.post(getApi("/admin/gallery-categories"), { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery-categories"] });
      setNewCategoryName("");
      toast.success("Kategori ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan kategori"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => axiosInterceptor.delete(getApi(`/admin/gallery-categories/${id}`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery-categories"] });
      toast.success("Kategori dihapus");
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      toast.error(
        status === 409
          ? "Kategori masih dipakai oleh foto lain, tidak bisa dihapus"
          : "Gagal menghapus kategori"
      );
    },
  });

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <div className="py-20 text-center text-sm text-neutral-400">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} foto</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            color="neutral"
            variant="outlined"
            startIcon={<Tag className="h-3.5 w-3.5" />}
            onClick={() => setShowCategoryManager((v) => !v)}
          >
            Kelola Kategori
          </Button>
          <Button size="sm" startIcon={<Plus className="h-3.5 w-3.5" />} onClick={openCreateForm}>
            Tambah Foto
          </Button>
        </div>
      </div>

      {showCategoryManager && (
        <div className="rounded-lg border border-neutral-100 bg-white p-6 space-y-4">
          <p className="text-sm font-semibold text-neutral-900">Kelola Kategori</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <TextField
                placeholder="Nama kategori baru"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
              onClick={() => createCategoryMutation.mutate(newCategoryName.trim())}
            >
              Tambah
            </Button>
          </div>
          <ul className="divide-y divide-neutral-50">
            {categories.length === 0 && (
              <li className="py-2 text-sm text-neutral-400">Belum ada kategori.</li>
            )}
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-700">{c.name}</span>
                <button
                  onClick={() => {
                    if (confirm(`Hapus kategori "${c.name}"?`)) deleteCategoryMutation.mutate(c.id);
                  }}
                  className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <div className="rounded-lg border border-neutral-100 bg-white p-6 space-y-4">
          <p className="text-sm font-semibold text-neutral-900">
            {editingId ? "Edit Foto" : "Foto Baru"}
          </p>
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
                value={form.category_id}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {categories.length === 0 && <option value="">Belum ada kategori</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="Judul (Indonesia)"
              value={form.title_id}
              onChange={(e) => setForm((p) => ({ ...p, title_id: e.target.value }))}
            />
            <TextField
              label="Title (English)"
              value={form.title_en}
              onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
            />
            <TextField
              label="Deskripsi (Indonesia)"
              value={form.desc_id}
              onChange={(e) => setForm((p) => ({ ...p, desc_id: e.target.value }))}
            />
            <TextField
              label="Description (English)"
              value={form.desc_en}
              onChange={(e) => setForm((p) => ({ ...p, desc_en: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={!form.image_url || !form.category_id || isSaving}>
              {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan"}
            </Button>
            <Button color="neutral" onClick={resetForm}>
              Batal
            </Button>
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
            <div
              key={item.id}
              className={`group relative rounded-lg overflow-hidden border ${
                item.is_visible ? "border-neutral-100" : "border-neutral-200 opacity-50"
              }`}
            >
              <div className="relative aspect-square bg-neutral-100">
                {item.image_url && (
                  <Image src={item.image_url} alt="" fill unoptimized className="object-cover" sizes="200px" />
                )}
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-neutral-400 uppercase">
                  {categoryName(item.category_id)}
                </p>
                <p className="text-xs text-neutral-700 truncate">{item.content.title_id || "—"}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditForm(item)}
                  className="h-7 w-7 rounded bg-white shadow flex items-center justify-center hover:bg-neutral-50"
                >
                  <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                </button>
                <button
                  onClick={() => toggleMutation.mutate({ id: item.id, is_visible: !item.is_visible })}
                  className="h-7 w-7 rounded bg-white shadow flex items-center justify-center hover:bg-neutral-50"
                >
                  {item.is_visible ? (
                    <Eye className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-neutral-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Hapus foto ini?")) deleteMutation.mutate(item.id);
                  }}
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