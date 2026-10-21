"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Save, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { ApiResponse, PageSection } from "@/interface/admin.interface";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea"; span?: "full" | "half" }
  | { key: string; label: string; type: "image"; folder?: string; span?: "full" | "half" }
  | { type: "divider"; label: string };

export interface SectionSchema {
  key: string;
  label: string;
  description: string;
  /** Tampilkan tombol sembunyikan/tampilkan. Hanya untuk section yang dicek halaman publiknya. */
  toggleable?: boolean;
  fields: FieldDef[];
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  schema: SectionSchema;
  section?: PageSection;
  pageSlug: string;
  onSave: (sectionKey: string, sectionId: string | null, content: Record<string, string>) => Promise<void>;
  saving: boolean;
    onToggle?: (sectionKey: string, sectionId: string | null, currentlyVisible: boolean) => Promise<void>;
  toggling?: boolean;
}

export function SectionCard({ schema, section, pageSlug: _pageSlug, onSave, saving, onToggle, toggling }: SectionCardProps) {  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const stored = (section?.content ?? {}) as Record<string, string>;
    const defaults: Record<string, string> = {};
    schema.fields.forEach((f) => {
      if (f.type !== "divider") defaults[f.key] = stored[f.key] ?? "";
    });
    return defaults;
  });
  const [dirty, setDirty] = useState(false);

  const visible = section?.is_visible !== false;
  const canToggle = Boolean(schema.toggleable && onToggle);
  const hasFields = schema.fields.some((f) => f.type !== "divider");

  useEffect(() => {
    const stored = (section?.content ?? {}) as Record<string, string>;
    const next: Record<string, string> = {};
    schema.fields.forEach((f) => {
      if (f.type !== "divider") next[f.key] = stored[f.key] ?? "";
    });
    setValues(next); // eslint-disable-line react-hooks/set-state-in-effect
    setDirty(false);
  }, [section, schema.fields]);

  const set = (key: string, val: string) => {
    setValues((p) => ({ ...p, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    await onSave(schema.key, section?.id ?? null, values);
    setDirty(false);
  };

  return (
    <div className="rounded-lg border border-neutral-100 bg-white">
            {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-neutral-900">{schema.label}</p>
            {canToggle && !visible && (
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500">
                Tersembunyi
              </span>
            )}
            {dirty && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Belum disimpan
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">{schema.description}</p>
        </div>
        {dirty && (
          <Button
            size="sm"
            startIcon={<Save className="h-3.5 w-3.5" />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
        {canToggle && (
          <button
            type="button"
            onClick={() => onToggle?.(schema.key, section?.id ?? null, visible)}
            disabled={toggling || dirty}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={visible ? "Sembunyikan section" : "Tampilkan section"}
            title={dirty ? "Simpan perubahan dulu" : visible ? "Sembunyikan" : "Tampilkan"}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
        {hasFields && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded p-1 text-neutral-400 hover:text-neutral-700"
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Fields */}
      {open && (
        <div className="border-t border-neutral-100 px-5 pb-6 pt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {schema.fields.map((field, i) => {
              if (field.type === "divider") {
                return (
                  <div key={i} className="sm:col-span-2 mt-2 first:mt-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-1">
                      {field.label}
                    </p>
                  </div>
                );
              }

              if (field.type === "image") {
                return (
                  <div key={field.key} className="sm:col-span-2">
                    <ImageUpload
                      label={field.label}
                      folder={field.folder ?? "pages"}
                      value={values[field.key] ?? ""}
                      onChange={(url) => set(field.key, url)}
                    />
                  </div>
                );
              }

              const colClass = field.span === "full" ? "sm:col-span-2" : "";

              if (field.type === "textarea") {
                return (
                  <div key={field.key} className={colClass}>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {field.label}
                    </label>
                    <textarea
                      rows={3}
                      value={values[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      className="w-full resize-y rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary focus:outline-none"
                    />
                  </div>
                );
              }

              return (
                <div key={field.key} className={colClass}>
                  <TextField
                    label={field.label}
                    value={values[field.key] ?? ""}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          {dirty && (
            <div className="mt-5 flex justify-end border-t border-neutral-100 pt-4">
              <Button
                size="sm"
                startIcon={<Save className="h-3.5 w-3.5" />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Section"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PageSchemaEditor ─────────────────────────────────────────────────────────

interface PageSchemaEditorProps {
  pageSlug: string;
  schemas: SectionSchema[];
}

export function PageSchemaEditor({ pageSlug, schemas }: PageSchemaEditorProps) {
  const qc = useQueryClient();
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-page-sections", pageSlug],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<{ sections: PageSection[] }>>(
        getApi(endpoints.cms.adminPageSections(pageSlug))
      );
      return res.data.data?.sections ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      sectionKey,
      sectionId,
      content,
    }: {
      sectionKey: string;
      sectionId: string | null;
      content: Record<string, string>;
    }) => {
      if (sectionId) {
        return axiosInterceptor.put(
          getApi(endpoints.cms.adminUpdateSection(sectionId)),
          { content }
        );
      }
      return axiosInterceptor.put(
        getApi(`/admin/cms/pages/${pageSlug}/sections/${sectionKey}`),
        { content }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", pageSlug] });
      toast.success("Section disimpan");
    },
    onError: () => toast.error("Gagal menyimpan section"),
  });

    const toggleMutation = useMutation({
    mutationFn: async ({
      sectionKey,
      sectionId,
      currentlyVisible,
    }: {
      sectionKey: string;
      sectionId: string | null;
      currentlyVisible: boolean;
    }) => {
      let id = sectionId;

      if (!id) {
        // Section belum ada di database: buat dulu dengan konten kosong, lalu baca id-nya.
        await axiosInterceptor.put(
          getApi(`/admin/cms/pages/${pageSlug}/sections/${sectionKey}`),
          { content: {} },
          { skipErrorToast: true }
        );
        const res = await axiosInterceptor.get<ApiResponse<{ sections: PageSection[] }>>(
          getApi(endpoints.cms.adminPageSections(pageSlug))
        );
        const created = res.data.data?.sections?.find((s) => s.section_key === sectionKey);
        if (!created) throw new Error("Section gagal dibuat");
        id = created.id;
        // Kalau baris baru sudah sesuai tujuan, tidak perlu di-toggle lagi.
        if (created.is_visible === !currentlyVisible) return;
      }

      return axiosInterceptor.patch(
        getApi(`/admin/cms/sections/${id}/toggle`),
        undefined,
        { skipErrorToast: true }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", pageSlug] });
      toast.success("Tampilan section diperbarui");
    },
    onError: () => toast.error("Gagal mengubah tampilan section"),
  });

  const handleToggle = useCallback(
    async (sectionKey: string, sectionId: string | null, currentlyVisible: boolean) => {
      setTogglingKey(sectionKey);
      try {
        await toggleMutation.mutateAsync({ sectionKey, sectionId, currentlyVisible });
      } catch {
        // pesan error sudah ditampilkan di onError
      } finally {
        setTogglingKey(null);
      }
    },
    [toggleMutation]
  );

  const handleSave = useCallback(
    async (sectionKey: string, sectionId: string | null, content: Record<string, string>) => {
      setSavingKey(sectionKey);
      try {
        await saveMutation.mutateAsync({ sectionKey, sectionId, content });
      } finally {
        setSavingKey(null);
      }
    },
    [saveMutation]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
        Memuat...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {schemas.map((schema) => (
        <SectionCard
          key={schema.key}
          schema={schema}
          section={sections?.find((s) => s.section_key === schema.key)}
          pageSlug={pageSlug}
          onSave={handleSave}
          saving={savingKey === schema.key}
          onToggle={handleToggle}
          toggling={togglingKey === schema.key}
        />
      ))}
    </div>
  );
}
