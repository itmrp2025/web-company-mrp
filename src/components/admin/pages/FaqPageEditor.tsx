"use client";

import { PageSchemaEditor, type SectionSchema } from "./PageSchemaEditor";

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman FAQ",
    fields: [
      { type: "divider", label: "Gambar" },
      { key: "image_url", label: "Gambar Hero", type: "image", folder: "pages" },
      { type: "divider", label: "Teks" },
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
    label: "CTA Bawah",
    description: "Prompt kontak di bagian bawah halaman FAQ",
    fields: [
      { key: "prompt_id", label: "Judul Prompt (Indonesia)", type: "text", span: "full" },
      { key: "prompt_en", label: "Prompt Heading (English)", type: "text", span: "full" },
      { key: "desc_id", label: "Deskripsi (Indonesia)", type: "textarea", span: "full" },
      { key: "desc_en", label: "Description (English)", type: "textarea", span: "full" },
      { key: "cta_id", label: "Tombol CTA (Indonesia)", type: "text" },
      { key: "cta_en", label: "CTA Button (English)", type: "text" },
    ],
  },
];

export function FaqPageEditor() {
  return <PageSchemaEditor pageSlug="faq" schemas={SCHEMAS} />;
}
