"use client";

import { PageSchemaEditor, type SectionSchema } from "./PageSchemaEditor";

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman kontak",
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
    key: "contact_info",
    label: "Informasi Kontak",
    description: "Alamat, telepon, email, WhatsApp, dan jam operasional",
    fields: [
      { type: "divider", label: "Kontak Utama" },
      { key: "phone", label: "Nomor Telepon", type: "text", span: "full" },
      { key: "whatsapp", label: "WhatsApp", type: "text", span: "full" },
      { key: "email", label: "Email", type: "text", span: "full" },
      { type: "divider", label: "Alamat" },
      { key: "address_id", label: "Alamat (Indonesia)", type: "textarea", span: "full" },
      { key: "address_en", label: "Address (English)", type: "textarea", span: "full" },
      { type: "divider", label: "Jam Operasional" },
      { key: "hours_weekday_id", label: "Senin–Jumat (Indonesia)", type: "text", span: "full" },
      { key: "hours_weekday_en", label: "Weekday Hours (English)", type: "text", span: "full" },
      { key: "hours_saturday_id", label: "Sabtu (Indonesia)", type: "text", span: "full" },
      { key: "hours_saturday_en", label: "Saturday Hours (English)", type: "text", span: "full" },
      { key: "hours_sunday_id", label: "Minggu (Indonesia)", type: "text", span: "full" },
      { key: "hours_sunday_en", label: "Sunday Hours (English)", type: "text", span: "full" },
    ],
  },
];

export function ContactPageEditor() {
  return <PageSchemaEditor pageSlug="contact" schemas={SCHEMAS} />;
}
