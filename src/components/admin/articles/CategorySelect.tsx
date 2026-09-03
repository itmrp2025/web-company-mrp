"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Select, type SelectOption } from "@/components/custom-ui/Select";
import type { ApiResponse, ArticleCategory } from "@/interface/admin.interface";

interface Props {
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

function parseCatContent(raw: unknown): { name_id: string; name_en: string } {
  let obj: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try { obj = JSON.parse(raw); } catch { /* noop */ }
  } else if (raw && typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }
  const idBlock = obj.id as Record<string, unknown> | undefined;
  const enBlock = obj.en as Record<string, unknown> | undefined;
  return {
    name_id: String(idBlock?.name ?? ""),
    name_en: String(enBlock?.name ?? ""),
  };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ─── Inline edit form shown inside the option row ────────────────────────────

interface EditFormProps {
  cat: ArticleCategory;
  initialNameId: string;
  initialNameEn: string;
  onCancel: () => void;
  onSaved: () => void;
}

function EditForm({ cat, initialNameId, initialNameEn, onCancel, onSaved }: EditFormProps) {
  const qc = useQueryClient();
  const [nameId, setNameId] = useState(initialNameId);
  const [nameEn, setNameEn] = useState(initialNameEn);

  const mut = useMutation({
    mutationFn: () =>
      axiosInterceptor.put(getApi(endpoints.articles.updateCategory(cat.id)), {
        slug: cat.slug,
        content: { id: { name: nameId }, en: { name: nameEn } },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["article-categories"] });
      toast.success("Kategori diperbarui");
      onSaved();
    },
    onError: () => toast.error("Gagal memperbarui kategori"),
  });

  return (
    <div className="flex w-full flex-col gap-1 px-3 py-2">
      <input
        autoFocus
        value={nameId}
        onChange={(e) => setNameId(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && nameId.trim()) mut.mutate(); if (e.key === "Escape") onCancel(); }}
        placeholder="Nama (Indonesia)"
        className="h-7 w-full rounded border border-neutral-200 px-2 text-xs outline-none focus:border-primary"
      />
      <input
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && nameId.trim()) mut.mutate(); if (e.key === "Escape") onCancel(); }}
        placeholder="Name (English)"
        className="h-7 w-full rounded border border-neutral-200 px-2 text-xs outline-none focus:border-primary"
      />
      <div className="flex justify-end gap-1 pt-0.5">
        <button
          type="button"
          onClick={() => mut.mutate()}
          disabled={mut.isPending || !nameId.trim()}
          className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-[10px] text-neutral-600 hover:bg-neutral-100"
        >
          <X className="h-3 w-3" />
          Batal
        </button>
      </div>
    </div>
  );
}

// ─── Add form shown in footer ─────────────────────────────────────────────────

function AddForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");

  const mut = useMutation({
    mutationFn: () =>
      axiosInterceptor.post(getApi(endpoints.articles.createCategory), {
        slug: slugify(nameId),
        content: { id: { name: nameId }, en: { name: nameEn || nameId } },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["article-categories"] });
      toast.success("Kategori ditambahkan");
      setNameId("");
      setNameEn("");
      onDone();
    },
    onError: () => toast.error("Gagal menambah kategori"),
  });

  return (
    <div className="flex flex-col gap-1 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">
        Tambah Kategori
      </p>
      <input
        autoFocus
        value={nameId}
        onChange={(e) => setNameId(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && nameId.trim()) mut.mutate(); }}
        placeholder="Nama (Indonesia) *"
        className="h-7 w-full rounded border border-neutral-200 px-2 text-xs outline-none focus:border-primary"
      />
      <input
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && nameId.trim()) mut.mutate(); }}
        placeholder="Name (English)"
        className="h-7 w-full rounded border border-neutral-200 px-2 text-xs outline-none focus:border-primary"
      />
      <div className="flex justify-end gap-1 pt-0.5">
        <button
          type="button"
          onClick={() => mut.mutate()}
          disabled={mut.isPending || !nameId.trim()}
          className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          Tambah
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-[10px] text-neutral-600 hover:bg-neutral-100"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CategorySelect({ value, onChange, error }: Props) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["article-categories"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<ArticleCategory[]>>(
        getApi(endpoints.articles.categories)
      );
      return res.data.data ?? [];
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.articles.deleteCategory(id))),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["article-categories"] });
      toast.success("Kategori dihapus");
      if (id === value) onChange("");
    },
    onError: () => toast.error("Gagal menghapus kategori"),
  });

  const catMap = Object.fromEntries(
    (categories ?? []).map((c) => [c.id, c])
  );

  const options: SelectOption[] = (categories ?? []).map((c) => ({
    value: c.id,
    label: parseCatContent(c.content).name_id,
  }));

  const footer = (
    <div>
      {adding ? (
        <AddForm onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setAdding(true); }}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah kategori baru
        </button>
      )}
    </div>
  );

  const renderOption = (opt: SelectOption, isSelected: boolean) => {
    const cat = catMap[opt.value];
    const content = cat ? parseCatContent(cat.content) : { name_id: opt.label, name_en: "" };

    if (editingId === opt.value && cat) {
      return (
        <EditForm
          cat={cat}
          initialNameId={content.name_id}
          initialNameEn={content.name_en}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
        />
      );
    }

    return (
      <div className="group flex w-full items-center justify-between pl-3 pr-2 py-2">
        {/* Label — click to select */}
        <span
          onClick={() => onChange(opt.value)}
          className={`flex-1 truncate text-sm ${isSelected ? "font-medium text-primary" : "text-neutral-700"}`}
        >
          {opt.label}
        </span>

        <div className="flex items-center gap-0.5">
          {/* Checkmark if selected */}
          {isSelected && (
            <Check className="h-3.5 w-3.5 shrink-0 text-primary mr-1" />
          )}

          {/* Edit button */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setEditingId(opt.value); setAdding(false); setConfirmDeleteId(null); }}
            className="rounded p-1 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-100 hover:text-primary"
            title="Edit"
          >
            <Pencil className="h-3 w-3" />
          </button>

          {/* Delete button — inline confirm, no window.confirm */}
          {confirmDeleteId === opt.value ? (
            <>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); deleteMut.mutate(opt.value); setConfirmDeleteId(null); }}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white bg-red-500 hover:bg-red-600"
              >
                Hapus
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(null); }}
                className="rounded px-1.5 py-0.5 text-[10px] text-neutral-500 hover:bg-neutral-100"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(opt.value); setEditingId(null); }}
              disabled={deleteMut.isPending && deleteMut.variables === opt.value}
              className="rounded p-1 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-100 hover:text-red-500 disabled:opacity-50"
              title="Hapus"
            >
              {deleteMut.isPending && deleteMut.variables === opt.value
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <Trash2 className="h-3 w-3" />
              }
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Select
      label="Kategori"
      placeholder={isLoading ? "Memuat..." : "Pilih kategori"}
      options={options}
      value={value}
      onChange={onChange}
      error={error}
      emptyText="Belum ada kategori"
      footer={footer}
      renderOption={renderOption}
    />
  );
}
