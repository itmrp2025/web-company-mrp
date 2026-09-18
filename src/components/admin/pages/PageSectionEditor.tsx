"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronDown, ChevronUp, Save, Plus } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import type { ApiResponse, PageSection } from "@/interface/admin.interface";

interface Props {
  pageSlug: string;
  pageLabel: string;
}

export function PageSectionEditor({ pageSlug, pageLabel }: Props) {
  const qc = useQueryClient();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for creating initial section
  const [addForm, setAddForm] = useState({
    title_id: pageLabel,
    title_en: pageLabel,
    body_id: "",
    body_en: "",
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-page-sections", pageSlug],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<{ sections: PageSection[] }>>(
        getApi(endpoints.cms.adminPageSections(pageSlug))
      );
      return res.data.data?.sections ?? [];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (sectionId: string) =>
      axiosInterceptor.patch(getApi(endpoints.cms.adminToggleSection(sectionId))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", pageSlug] });
      toast.success("Visibilitas section diperbarui");
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: string; content: Record<string, unknown> }) =>
      axiosInterceptor.put(getApi(endpoints.cms.adminUpdateSection(sectionId)), { content }),
    onSuccess: (_, { sectionId }) => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", pageSlug] });
      setDrafts((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
      toast.success("Section disimpan");
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: (content: Record<string, unknown>) =>
      axiosInterceptor.put(getApi(`/admin/cms/pages/${pageSlug}/sections/content`), { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", pageSlug] });
      setIsAddModalOpen(false);
      toast.success("Konten berhasil dibuat");
    },
  });

  const updateDraft = (sectionId: string, key: string, value: unknown) => {
    setDrafts((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] ?? {}), [key]: value },
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Memuat...</div>;
  }

  if (!sections?.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900">Belum ada konten / section</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Halaman ini belum memiliki section konten. Klik tombol di bawah untuk membuat konten pertama.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => setIsAddModalOpen(true)} startIcon={<Plus className="h-4 w-4" />}>
            Tambah Konten
          </Button>
        </div>

        {/* Modal / Form Tambah Konten */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl text-left max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Buat Konten Halaman {pageLabel}</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Judul (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={addForm.title_id}
                    onChange={(e) => setAddForm({ ...addForm, title_id: e.target.value })}
                    className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Judul (English)
                  </label>
                  <input
                    type="text"
                    value={addForm.title_en}
                    onChange={(e) => setAddForm({ ...addForm, title_en: e.target.value })}
                    className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Isi / Body (Indonesia) - Rich Text / HTML
                  </label>
                  <RichTextEditor
                    value={addForm.body_id}
                    onChange={(val) => setAddForm({ ...addForm, body_id: val })}
                    placeholder="Tulis kebijakan / syarat ketentuan dalam Bahasa Indonesia..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Isi / Body (English) - Rich Text / HTML
                  </label>
                  <RichTextEditor
                    value={addForm.body_en}
                    onChange={(val) => setAddForm({ ...addForm, body_en: val })}
                    placeholder="Write policy / terms in English..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outlined" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </Button>
                <Button
                  onClick={() => createSectionMutation.mutate(addForm)}
                  disabled={createSectionMutation.isPending}
                >
                  {createSectionMutation.isPending ? "Menyimpan..." : "Simpan & Buat"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((section) => {
          const isOpen = openSection === section.id;
          const draft = drafts[section.id] ?? {};
          const merged = { ...section.content, ...draft };
          const hasDraft = Object.keys(draft).length > 0;

          return (
            <div key={section.id} className="rounded-lg border border-neutral-100 bg-white">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => toggleMutation.mutate(section.id)}
                  className={`rounded p-1 transition-colors ${section.is_visible ? "text-primary" : "text-neutral-300"}`}
                  title={section.is_visible ? "Sembunyikan" : "Tampilkan"}
                >
                  {section.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 capitalize">
                    {section.section_key.replace(/_/g, " ")}
                  </p>
                  {hasDraft && (
                    <span className="text-xs text-amber-600 font-medium">● Belum disimpan</span>
                  )}
                </div>
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="rounded p-1 text-neutral-400 hover:text-neutral-700"
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {/* Editor */}
              {isOpen && (
                <div className="border-t border-neutral-100 px-5 pb-5 pt-4">
                  <div className="space-y-6">
                    {Object.entries(merged).map(([key, val]) => {
                      const strVal = typeof val === "string" ? val : JSON.stringify(val);
                      const isHtmlOrLong = strVal.length > 80 || strVal.includes("<") || strVal.includes("\n");

                      return (
                        <div key={key}>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            {key.replace(/_/g, " ")}
                          </label>
                          {isHtmlOrLong ? (
                            <RichTextEditor
                              value={strVal}
                              onChange={(html) => updateDraft(section.id, key, html)}
                              placeholder={`Tulis ${key.replace(/_/g, " ")}...`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={strVal}
                              onChange={(e) => updateDraft(section.id, key, e.target.value)}
                              className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {hasDraft && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        size="sm"
                        startIcon={<Save className="h-3.5 w-3.5" />}
                        onClick={() => saveMutation.mutate({ sectionId: section.id, content: merged as Record<string, unknown> })}
                        disabled={saveMutation.isPending}
                      >
                        {saveMutation.isPending ? "Menyimpan..." : "Simpan Section"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
