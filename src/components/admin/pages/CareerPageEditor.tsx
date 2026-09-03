"use client";

import { PageSchemaEditor, type SectionSchema } from "./PageSchemaEditor";

const SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Banner utama halaman karir",
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
    key: "perks",
    label: "Keunggulan Bergabung",
    description: "4 poin keunggulan bergabung bersama MRP Law Office",
    fields: [
      { type: "divider", label: "Perk 1 — Kompensasi" },
      { key: "perk1_id", label: "Perk 1 (Indonesia)", type: "text" },
      { key: "perk1_en", label: "Perk 1 (English)", type: "text" },
      { type: "divider", label: "Perk 2 — Kolaborasi" },
      { key: "perk2_id", label: "Perk 2 (Indonesia)", type: "text" },
      { key: "perk2_en", label: "Perk 2 (English)", type: "text" },
      { type: "divider", label: "Perk 3 — Internasional" },
      { key: "perk3_id", label: "Perk 3 (Indonesia)", type: "text" },
      { key: "perk3_en", label: "Perk 3 (English)", type: "text" },
      { type: "divider", label: "Perk 4 — Pengembangan Karir" },
      { key: "perk4_id", label: "Perk 4 (Indonesia)", type: "text" },
      { key: "perk4_en", label: "Perk 4 (English)", type: "text" },
    ],
  },
];

export function CareerPageEditor() {
  return <PageSchemaEditor pageSlug="career" schemas={SCHEMAS} />;
}
