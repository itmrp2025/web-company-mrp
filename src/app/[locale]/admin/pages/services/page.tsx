"use client";

import { useState } from "react";
import { ServicesPageEditor } from "@/components/admin/pages/ServicesPageEditor";
import { ServicesDataPanel } from "@/components/admin/services/ServicesDataPanel";

type Tab = "konten" | "data";

export default function AdminPageServicesPage() {
  const [tab, setTab] = useState<Tab>("konten");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Layanan</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Kelola konten halaman dan data layanan</p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-neutral-100">
        {([["konten", "Konten Halaman"], ["data", "Data Layanan"]] as [Tab, string][]).map(([id, label]) => (
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

      {tab === "konten" ? <ServicesPageEditor /> : <ServicesDataPanel />}
    </div>
  );
}
