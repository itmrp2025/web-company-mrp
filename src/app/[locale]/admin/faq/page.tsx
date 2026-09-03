"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";

interface FAQ {
  id: string;
  category: string;
  order_index: number;
  is_visible: boolean;
  content: {
    id: { question: string; answer: string };
    en: { question: string; answer: string };
  };
  created_at: string;
}

interface ApiResponse<T> { success: boolean; data: T; message: string; }

interface FAQForm {
  category: string;
  order_index: number;
  is_visible: boolean;
  content: FAQ["content"];
}

const emptyForm = (): FAQForm => ({
  category: "general",
  order_index: 0,
  is_visible: true,
  content: {
    id: { question: "", answer: "" },
    en: { question: "", answer: "" },
  },
});

const categoryOptions = ["general", "consultation", "fees", "process", "confidentiality"];

export default function AdminFaqPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FAQForm>(emptyForm());

  const { data, isLoading } = useQuery({
    queryKey: ["admin-faq"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<FAQ[]>>(
        getApi(endpoints.faq.adminList)
      );
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: FAQForm) =>
      axiosInterceptor.post(getApi(endpoints.faq.create), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faq"] });
      toast.success("FAQ berhasil dibuat");
      setCreating(false);
      setForm(emptyForm());
    },
    onError: () => toast.error("Gagal membuat FAQ"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FAQForm }) =>
      axiosInterceptor.put(getApi(endpoints.faq.update(id)), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faq"] });
      toast.success("FAQ diperbarui");
      setEditing(null);
    },
    onError: () => toast.error("Gagal memperbarui FAQ"),
  });

  const toggleMutation = useMutation({
    mutationFn: (faq: FAQ) =>
      axiosInterceptor.put(getApi(endpoints.faq.update(faq.id)), {
        ...faq,
        is_visible: !faq.is_visible,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faq"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.faq.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faq"] });
      toast.success("FAQ dihapus");
    },
  });

  const openCreate = () => {
    setForm(emptyForm());
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (faq: FAQ) => {
    setForm({
      category: faq.category,
      order_index: faq.order_index,
      is_visible: faq.is_visible,
      content: faq.content,
    });
    setEditing(faq);
    setCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isFormOpen = creating || !!editing;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">FAQ</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} pertanyaan</p>
        </div>
        <Button startIcon={<Plus className="h-4 w-4" />} size="sm" onClick={openCreate}>
          Tambah FAQ
        </Button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-neutral-900">
            {editing ? "Edit FAQ" : "FAQ Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="h-9 border border-neutral-200 px-3 text-sm focus:border-primary focus:outline-none"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">Urutan</label>
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value) }))}
                  className="h-9 border border-neutral-200 px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Bahasa Indonesia</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-500">Pertanyaan</label>
                  <input
                    required
                    value={form.content.id.question}
                    onChange={(e) => setForm((p) => ({ ...p, content: { ...p.content, id: { ...p.content.id, question: e.target.value } } }))}
                    className="h-9 border border-neutral-200 px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-500">Jawaban</label>
                  <textarea
                    required
                    rows={4}
                    value={form.content.id.answer}
                    onChange={(e) => setForm((p) => ({ ...p, content: { ...p.content, id: { ...p.content.id, answer: e.target.value } } }))}
                    className="resize-none border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">English</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-500">Question</label>
                  <input
                    required
                    value={form.content.en.question}
                    onChange={(e) => setForm((p) => ({ ...p, content: { ...p.content, en: { ...p.content.en, question: e.target.value } } }))}
                    className="h-9 border border-neutral-200 px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-500">Answer</label>
                  <textarea
                    required
                    rows={4}
                    value={form.content.en.answer}
                    onChange={(e) => setForm((p) => ({ ...p, content: { ...p.content, en: { ...p.content.en, answer: e.target.value } } }))}
                    className="resize-none border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
              <Button type="submit" size="sm" loading={createMutation.isPending || updateMutation.isPending}>
                {editing ? "Perbarui" : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="neutral"
                size="sm"
                onClick={() => { setCreating(false); setEditing(null); }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-400">Belum ada FAQ</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Pertanyaan</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">Kategori</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((faq) => (
                <tr key={faq.id} className="group hover:bg-neutral-50/50">
                  <td className="px-5 py-4">
                    <p className={`font-medium line-clamp-1 ${faq.is_visible ? "text-neutral-900" : "text-neutral-400"}`}>
                      {faq.content?.id?.question ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">
                      {faq.content?.id?.answer ?? ""}
                    </p>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 capitalize">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleMutation.mutate(faq)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title={faq.is_visible ? "Sembunyikan" : "Tampilkan"}
                      >
                        {faq.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(faq)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus FAQ ini?`)) deleteMutation.mutate(faq.id);
                        }}
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
