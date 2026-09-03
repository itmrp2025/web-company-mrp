"use client";

import { PageSchemaEditor, type SectionSchema } from "./PageSchemaEditor";

const SERVICE_KEYS = [
  { key: "litigation", label: "Litigasi" },
  { key: "corporate", label: "Hukum Korporat" },
  { key: "regulatory", label: "Regulasi & Kepatuhan" },
  { key: "professional", label: "Jasa Profesional" },
  { key: "digital", label: "Hukum Digital" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "property", label: "Properti" },
  { key: "family", label: "Hukum Keluarga" },
  { key: "employment", label: "Ketenagakerjaan" },
  { key: "intellectual", label: "Kekayaan Intelektual" },
  { key: "immigration", label: "Imigrasi" },
  { key: "environmental", label: "Lingkungan" },
  { key: "criminal", label: "Hukum Pidana" },
];

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman Layanan",
    fields: [
      { type: "divider", label: "Gambar Hero" },
      { key: "image_url", label: "Gambar Hero", type: "image", folder: "pages" },
      { type: "divider", label: "Badge" },
      { key: "badge_id", label: "Badge (Indonesia)", type: "text" },
      { key: "badge_en", label: "Badge (English)", type: "text" },
      { type: "divider", label: "Heading" },
      { key: "heading_id", label: "Heading (Indonesia)", type: "text", span: "full" },
      { key: "heading_en", label: "Heading (English)", type: "text", span: "full" },
      { type: "divider", label: "Subheading" },
      { key: "subheading_id", label: "Subheading (Indonesia)", type: "textarea", span: "full" },
      { key: "subheading_en", label: "Subheading (English)", type: "textarea", span: "full" },
    ],
  },
  {
    key: "services_list",
    label: "Daftar Layanan Hukum",
    description: "Nama dan deskripsi 13 layanan hukum (bilingual)",
    fields: SERVICE_KEYS.flatMap(({ key, label }) => [
      { type: "divider" as const, label },
      { key: `${key}_name_id`, label: `Nama: ${label} (Indonesia)`, type: "text" as const },
      { key: `${key}_name_en`, label: `Name: ${label} (English)`, type: "text" as const },
      { key: `${key}_desc_id`, label: `Deskripsi (Indonesia)`, type: "textarea" as const, span: "full" as const },
      { key: `${key}_desc_en`, label: `Description (English)`, type: "textarea" as const, span: "full" as const },
    ]),
  },
  {
    key: "cta",
    label: "CTA Kontak",
    description: "Section ajakan menghubungi kantor di bagian bawah",
    fields: [
      { key: "cta_title_id", label: "Judul CTA (Indonesia)", type: "text", span: "full" },
      { key: "cta_title_en", label: "CTA Title (English)", type: "text", span: "full" },
      { key: "cta_sub_id", label: "Sub-teks (Indonesia)", type: "textarea", span: "full" },
      { key: "cta_sub_en", label: "Sub-text (English)", type: "textarea", span: "full" },
      { key: "cta_contact_id", label: "Label Tombol (Indonesia)", type: "text" },
      { key: "cta_contact_en", label: "Button Label (English)", type: "text" },
    ],
  },
];

export function ServicesPageEditor() {
  return <PageSchemaEditor pageSlug="services" schemas={SCHEMAS} />;
}
