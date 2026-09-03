"use client";

import { PageSchemaEditor, type SectionSchema } from "./PageSchemaEditor";

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman Tim",
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
    key: "labels",
    label: "Label Peran & Grup",
    description: "Judul peran dan label grup anggota tim",
    fields: [
      { type: "divider", label: "Peran / Role" },
      { key: "role_founder_id", label: "Judul Pendiri (Indonesia)", type: "text" },
      { key: "role_founder_en", label: "Founder Title (English)", type: "text" },
      { key: "role_senior_id", label: "Judul Senior Associate (Indonesia)", type: "text" },
      { key: "role_senior_en", label: "Senior Associate Title (English)", type: "text" },
      { key: "role_associate_id", label: "Judul Associate (Indonesia)", type: "text" },
      { key: "role_associate_en", label: "Associate Title (English)", type: "text" },
      { type: "divider", label: "Label Grup" },
      { key: "associates_label_id", label: "Label Grup Associates (Indonesia)", type: "text" },
      { key: "associates_label_en", label: "Associates Group Label (English)", type: "text" },
    ],
  },
  {
    key: "career_cta",
    label: "CTA Karir",
    description: "Section ajakan bergabung sebagai anggota tim",
    fields: [
      { key: "career_cta_id", label: "Heading CTA (Indonesia)", type: "text", span: "full" },
      { key: "career_cta_en", label: "CTA Heading (English)", type: "text", span: "full" },
      { key: "career_sub_id", label: "Sub-teks (Indonesia)", type: "textarea", span: "full" },
      { key: "career_sub_en", label: "Sub-text (English)", type: "textarea", span: "full" },
      { key: "career_btn_id", label: "Label Tombol (Indonesia)", type: "text" },
      { key: "career_btn_en", label: "Button Label (English)", type: "text" },
    ],
  },
];

export function TeamPageEditor() {
  return <PageSchemaEditor pageSlug="team" schemas={SCHEMAS} />;
}
