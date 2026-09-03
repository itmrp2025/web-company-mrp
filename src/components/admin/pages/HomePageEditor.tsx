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

// ─── Section schemas ──────────────────────────────────────────────────────────

type FieldDef =
  | { key: string; label: string; type: "text" | "textarea"; span?: "full" | "half" }
  | { key: string; label: string; type: "image"; folder?: string }
  | { type: "divider"; label: string };

interface SectionSchema {
  key: string;
  label: string;
  description: string;
  fields: FieldDef[];
}

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman beranda",
    fields: [
      { type: "divider", label: "Gambar Hero" },
      { key: "image_url", label: "Gambar Hero", type: "image", folder: "pages" },
      { type: "divider", label: "Badge & Eyebrow" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { type: "divider", label: "Heading" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { type: "divider", label: "Subheading" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Tombol CTA" },
      { key: "cta_primary_id", label: "Tombol Utama (Indonesia)", type: "text" },
      { key: "cta_primary_en", label: "Primary Button (English)", type: "text" },
      { key: "cta_secondary_id", label: "Tombol Kedua (Indonesia)", type: "text" },
      { key: "cta_secondary_en", label: "Secondary Button (English)", type: "text" },
    ],
  },
  {
    key: "stats",
    label: "Statistik",
    description: "4 angka statistik di bawah hero",
    fields: [
      { type: "divider", label: "Angka (value)" },
      { key: "years_value", label: "Angka Tahun", type: "text" },
      { key: "clients_value", label: "Angka Klien", type: "text" },
      { key: "cases_value", label: "Angka Kasus", type: "text" },
      { key: "areas_value", label: "Angka Bidang Hukum", type: "text" },
      { type: "divider", label: "Label Statistik" },
      { key: "years_label_id", label: "Label Tahun (Indonesia)", type: "text" },
      { key: "years_label_en", label: "Years Label (English)", type: "text" },
      { key: "clients_label_id", label: "Label Klien (Indonesia)", type: "text" },
      { key: "clients_label_en", label: "Clients Label (English)", type: "text" },
      { key: "cases_label_id", label: "Label Kasus (Indonesia)", type: "text" },
      { key: "cases_label_en", label: "Cases Label (English)", type: "text" },
      { key: "areas_label_id", label: "Label Bidang (Indonesia)", type: "text" },
      { key: "areas_label_en", label: "Areas Label (English)", type: "text" },
    ],
  },
  {
    key: "services_section",
    label: "Section Layanan",
    description: "Header section grid layanan hukum",
    fields: [
      { type: "divider", label: "Badge" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { type: "divider", label: "Heading" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { type: "divider", label: "Subheading" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Label" },
      { key: "view_all_id", label: "Label \"Lihat Semua\" (Indonesia)", type: "text" },
      { key: "view_all_en", label: "\"View All\" Label (English)", type: "text" },
      { type: "divider", label: "Konten Per Layanan (Home Preview)" },
      { key: "litigation_name_id", label: "Litigasi - Nama (Indonesia)", type: "text" },
      { key: "litigation_name_en", label: "Litigation - Name (English)", type: "text" },
      { key: "litigation_desc_id", label: "Litigasi - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "litigation_desc_en", label: "Litigation - Description (English)", type: "textarea", span: "full" },
      { key: "corporate_name_id", label: "Korporasi - Nama (Indonesia)", type: "text" },
      { key: "corporate_name_en", label: "Corporate - Name (English)", type: "text" },
      { key: "corporate_desc_id", label: "Korporasi - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "corporate_desc_en", label: "Corporate - Description (English)", type: "textarea", span: "full" },
      { key: "regulatory_name_id", label: "Regulasi - Nama (Indonesia)", type: "text" },
      { key: "regulatory_name_en", label: "Regulatory - Name (English)", type: "text" },
      { key: "regulatory_desc_id", label: "Regulasi - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "regulatory_desc_en", label: "Regulatory - Description (English)", type: "textarea", span: "full" },
      { key: "professional_name_id", label: "Profesi - Nama (Indonesia)", type: "text" },
      { key: "professional_name_en", label: "Professional - Name (English)", type: "text" },
      { key: "professional_desc_id", label: "Profesi - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "professional_desc_en", label: "Professional - Description (English)", type: "textarea", span: "full" },
      { key: "digital_name_id", label: "Digital - Nama (Indonesia)", type: "text" },
      { key: "digital_name_en", label: "Digital - Name (English)", type: "text" },
      { key: "digital_desc_id", label: "Digital - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "digital_desc_en", label: "Digital - Description (English)", type: "textarea", span: "full" },
      { key: "ecommerce_name_id", label: "E-Commerce - Nama (Indonesia)", type: "text" },
      { key: "ecommerce_name_en", label: "E-Commerce - Name (English)", type: "text" },
      { key: "ecommerce_desc_id", label: "E-Commerce - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "ecommerce_desc_en", label: "E-Commerce - Description (English)", type: "textarea", span: "full" },
      { key: "property_name_id", label: "Properti - Nama (Indonesia)", type: "text" },
      { key: "property_name_en", label: "Property - Name (English)", type: "text" },
      { key: "property_desc_id", label: "Properti - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "property_desc_en", label: "Property - Description (English)", type: "textarea", span: "full" },
      { key: "family_name_id", label: "Keluarga - Nama (Indonesia)", type: "text" },
      { key: "family_name_en", label: "Family - Name (English)", type: "text" },
      { key: "family_desc_id", label: "Keluarga - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "family_desc_en", label: "Family - Description (English)", type: "textarea", span: "full" },
      { key: "employment_name_id", label: "Ketenagakerjaan - Nama (Indonesia)", type: "text" },
      { key: "employment_name_en", label: "Employment - Name (English)", type: "text" },
      { key: "employment_desc_id", label: "Ketenagakerjaan - Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "employment_desc_en", label: "Employment - Description (English)", type: "textarea", span: "full" },
    ],
  },
  {
    key: "meet_leaders",
    label: "Meet the Leaders",
    description: "Profil pendiri/managing partner",
    fields: [
      { type: "divider", label: "Section Header" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Profil Pendiri" },
      { key: "founder_name", label: "Nama Lengkap", type: "text", span: "full" },
      { key: "founder_role_id", label: "Jabatan (Indonesia)", type: "text" },
      { key: "founder_role_en", label: "Role (English)", type: "text" },
      { key: "founder_bio_id", label: "Bio (Indonesia)", type: "textarea", span: "full" },
      { key: "founder_bio_en", label: "Bio (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Kredensial (3 item)" },
      { key: "credential_1_id", label: "Kredensial 1 (Indonesia)", type: "text" },
      { key: "credential_1_en", label: "Credential 1 (English)", type: "text" },
      { key: "credential_2_id", label: "Kredensial 2 (Indonesia)", type: "text" },
      { key: "credential_2_en", label: "Credential 2 (English)", type: "text" },
      { key: "credential_3_id", label: "Kredensial 3 (Indonesia)", type: "text" },
      { key: "credential_3_en", label: "Credential 3 (English)", type: "text" },
      { type: "divider", label: "Link & Tombol" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "text" },
      { key: "instagram_url", label: "Instagram URL", type: "text" },
      { key: "view_team_id", label: "Tombol Lihat Tim (Indonesia)", type: "text" },
      { key: "view_team_en", label: "View Team Button (English)", type: "text" },
    ],
  },
  {
    key: "recent_articles",
    label: "Artikel Terbaru",
    description: "Header section artikel terbaru",
    fields: [
      { type: "divider", label: "Badge & Heading" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Label" },
      { key: "read_more_id", label: "Tombol Baca Artikel (Indonesia)", type: "text" },
      { key: "read_more_en", label: "Read More Button (English)", type: "text" },
      { key: "view_all_id", label: "Lihat Semua Artikel (Indonesia)", type: "text" },
      { key: "view_all_en", label: "View All Articles (English)", type: "text" },
      { key: "min_read_id", label: "Teks Menit Baca (Indonesia)", type: "text" },
      { key: "min_read_en", label: "Reading Time Text (English)", type: "text" },
    ],
  },
  {
    key: "why_choose",
    label: "Mengapa Memilih Kami",
    description: "Section alasan utama memilih MRP Law Office",
    fields: [
      { type: "divider", label: "Heading" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 1" },
      { key: "reason1_title_id", label: "Judul Alasan 1 (Indonesia)", type: "text" },
      { key: "reason1_title_en", label: "Reason 1 Title (English)", type: "text" },
      { key: "reason1_desc_id", label: "Deskripsi Alasan 1 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason1_desc_en", label: "Reason 1 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 2" },
      { key: "reason2_title_id", label: "Judul Alasan 2 (Indonesia)", type: "text" },
      { key: "reason2_title_en", label: "Reason 2 Title (English)", type: "text" },
      { key: "reason2_desc_id", label: "Deskripsi Alasan 2 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason2_desc_en", label: "Reason 2 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 3" },
      { key: "reason3_title_id", label: "Judul Alasan 3 (Indonesia)", type: "text" },
      { key: "reason3_title_en", label: "Reason 3 Title (English)", type: "text" },
      { key: "reason3_desc_id", label: "Deskripsi Alasan 3 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason3_desc_en", label: "Reason 3 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 4" },
      { key: "reason4_title_id", label: "Judul Alasan 4 (Indonesia)", type: "text" },
      { key: "reason4_title_en", label: "Reason 4 Title (English)", type: "text" },
      { key: "reason4_desc_id", label: "Deskripsi Alasan 4 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason4_desc_en", label: "Reason 4 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 5" },
      { key: "reason5_title_id", label: "Judul Alasan 5 (Indonesia)", type: "text" },
      { key: "reason5_title_en", label: "Reason 5 Title (English)", type: "text" },
      { key: "reason5_desc_id", label: "Deskripsi Alasan 5 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason5_desc_en", label: "Reason 5 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Alasan 6" },
      { key: "reason6_title_id", label: "Judul Alasan 6 (Indonesia)", type: "text" },
      { key: "reason6_title_en", label: "Reason 6 Title (English)", type: "text" },
      { key: "reason6_desc_id", label: "Deskripsi Alasan 6 (Indonesia)", type: "textarea", span: "full" },
      { key: "reason6_desc_en", label: "Reason 6 Description (English)", type: "textarea", span: "full" },
    ],
  },
  {
    key: "process",
    label: "Proses Kerja",
    description: "4 tahap proses kerja firma",
    fields: [
      { type: "divider", label: "Header" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Langkah 1" },
      { key: "step1_title_id", label: "Judul Langkah 1 (Indonesia)", type: "text" },
      { key: "step1_title_en", label: "Step 1 Title (English)", type: "text" },
      { key: "step1_desc_id", label: "Deskripsi Langkah 1 (Indonesia)", type: "textarea", span: "full" },
      { key: "step1_desc_en", label: "Step 1 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Langkah 2" },
      { key: "step2_title_id", label: "Judul Langkah 2 (Indonesia)", type: "text" },
      { key: "step2_title_en", label: "Step 2 Title (English)", type: "text" },
      { key: "step2_desc_id", label: "Deskripsi Langkah 2 (Indonesia)", type: "textarea", span: "full" },
      { key: "step2_desc_en", label: "Step 2 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Langkah 3" },
      { key: "step3_title_id", label: "Judul Langkah 3 (Indonesia)", type: "text" },
      { key: "step3_title_en", label: "Step 3 Title (English)", type: "text" },
      { key: "step3_desc_id", label: "Deskripsi Langkah 3 (Indonesia)", type: "textarea", span: "full" },
      { key: "step3_desc_en", label: "Step 3 Description (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Langkah 4" },
      { key: "step4_title_id", label: "Judul Langkah 4 (Indonesia)", type: "text" },
      { key: "step4_title_en", label: "Step 4 Title (English)", type: "text" },
      { key: "step4_desc_id", label: "Deskripsi Langkah 4 (Indonesia)", type: "textarea", span: "full" },
      { key: "step4_desc_en", label: "Step 4 Description (English)", type: "textarea", span: "full" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimoni",
    description: "Header section testimoni klien",
    fields: [
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
    ],
  },
  {
    key: "cta",
    label: "CTA & Kontak",
    description: "Section konsultasi dan informasi kantor",
    fields: [
      { type: "divider", label: "Badge & Heading" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Tombol CTA" },
      { key: "cta_label_id", label: "Label Tombol (Indonesia)", type: "text" },
      { key: "cta_label_en", label: "Button Label (English)", type: "text" },
      { type: "divider", label: "Kontak" },
      { key: "phone", label: "Nomor Telepon", type: "text", span: "full" },
    ],
  },
];

// ─── Single section card ──────────────────────────────────────────────────────

interface SectionCardProps {
  schema: SectionSchema;
  section?: PageSection;
  onSave: (sectionKey: string, sectionId: string | null, content: Record<string, string>) => Promise<void>;
  saving: boolean;
}

function SectionCard({ schema, section, onSave, saving }: SectionCardProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const stored = (section?.content ?? {}) as Record<string, string>;
    const defaults: Record<string, string> = {};
    schema.fields.forEach((f) => {
      if (f.type !== "divider") defaults[f.key] = stored[f.key] ?? "";
    });
    return defaults;
  });
  const [dirty, setDirty] = useState(false);
  const [visible, setVisible] = useState(section?.is_visible ?? true);

  useEffect(() => {
    const stored = (section?.content ?? {}) as Record<string, string>;
    const next: Record<string, string> = {};
    schema.fields.forEach((f) => {
      if (f.type !== "divider") next[f.key] = stored[f.key] ?? "";
    });
    setValues(next);
    setDirty(false);
    setVisible(section?.is_visible ?? true);
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
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          title={visible ? "Sembunyikan section" : "Tampilkan section"}
          className={`rounded p-1 transition-colors ${visible ? "text-primary" : "text-neutral-300"}`}
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">{schema.label}</p>
          <p className="text-xs text-neutral-400">{schema.description}</p>
          {dirty && (
            <span className="text-xs font-medium text-amber-600">● Perubahan belum disimpan</span>
          )}
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
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded p-1 text-neutral-400 hover:text-neutral-700"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
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

// ─── Main editor ─────────────────────────────────────────────────────────────

export function HomePageEditor() {
  const qc = useQueryClient();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["admin-page-sections", "home"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<{ sections: PageSection[] }>>(
        getApi(endpoints.cms.adminPageSections("home"))
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
      // Create via page+key endpoint
      return axiosInterceptor.put(
        getApi(`/admin/cms/pages/home/sections/${sectionKey}`),
        { content }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections", "home"] });
      toast.success("Section disimpan");
    },
    onError: () => toast.error("Gagal menyimpan section"),
  });

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

  const getSectionByKey = (key: string) =>
    pageData?.find((s) => s.section_key === key);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
        Memuat...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {SCHEMAS.map((schema) => (
        <SectionCard
          key={schema.key}
          schema={schema}
          section={getSectionByKey(schema.key)}
          onSave={handleSave}
          saving={savingKey === schema.key}
        />
      ))}
    </div>
  );
}
