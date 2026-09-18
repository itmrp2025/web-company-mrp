"use client";

import { use } from "react";
import { PageSectionEditor } from "@/components/admin/pages/PageSectionEditor";

const SLUG_TITLE_MAP: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
};

export default function AdminGenericPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const pageTitle = SLUG_TITLE_MAP[slug] || `Halaman ${slug}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">{pageTitle}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Kelola konten tiap section halaman {slug}
        </p>
      </div>
      <PageSectionEditor pageSlug={slug} pageLabel={pageTitle} />
    </div>
  );
}
