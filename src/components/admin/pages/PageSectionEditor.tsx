"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronDown, ChevronUp, Save } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import type { ApiResponse, PageSection } from "@/interface/admin.interface";

interface Props {
  pageSlug: string;
  pageLabel: string;
}

export function PageSectionEditor({ pageSlug, pageLabel }: Props) {
  const qc = useQueryClient();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});

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

  const updateDraft = (sectionId: string, key: string, value: string) => {
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
      <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
        Tidak ada section ditemukan untuk halaman ini
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
                  <div className="space-y-4">
                    {Object.entries(merged).map(([key, val]) => {
                      const strVal = typeof val === "string" ? val : JSON.stringify(val);
                      const isLong = strVal.length > 100 || strVal.includes("\n");
                      return (
                        <div key={key}>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            {key.replace(/_/g, " ")}
                          </label>
                          {isLong ? (
                            <textarea
                              rows={5}
                              value={strVal}
                              onChange={(e) => updateDraft(section.id, key, e.target.value)}
                              className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                    <div className="mt-4 flex justify-end">
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
