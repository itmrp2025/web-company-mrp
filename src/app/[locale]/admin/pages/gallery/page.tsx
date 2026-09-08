"use client";

import { useState } from "react";
import { GalleryPageEditor } from "@/components/admin/pages/GalleryPageEditor";
import { GalleryManager } from "@/components/admin/gallery/GalleryManager";

type Tab = "konten" | "foto";

export default function AdminPageGalleryPage() {
  const [tab, setTab] = useState<Tab>("foto");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Galeri</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola foto galeri dan konten halaman</p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-neutral-100">
        {([["foto", "Foto Galeri"], ["konten", "Konten Halaman"]] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === id
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "foto" ? <GalleryManager /> : <GalleryPageEditor />}
    </div>
  );
}
