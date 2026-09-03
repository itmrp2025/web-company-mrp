"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Button } from "@/components/custom-ui/Button";
import { Eye, EyeOff } from "lucide-react";
import type { ApiResponse, NavigationItem } from "@/interface/admin.interface";

export default function AdminSettingsNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-navigation"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<NavigationItem[]>>(
        getApi(endpoints.cms.navigation)
      );
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      axiosInterceptor.put(getApi(endpoints.cms.adminUpdateNavigation), items),
    onSuccess: () => toast.success("Navigasi disimpan"),
  });

  const toggleVisible = (key: string) => {
    setItems((prev) =>
      prev.map((item) => item.key === key ? { ...item, is_visible: !item.is_visible } : item)
    );
  };

  const updateLabel = (key: string, field: "label_id" | "label_en", value: string) => {
    setItems((prev) =>
      prev.map((item) => item.key === key ? { ...item, [field]: value } : item)
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Memuat...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Pengaturan Navigasi</h1>
          <p className="mt-0.5 text-sm text-neutral-500">Kelola menu navigasi website</p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-100 bg-white">
        {!items.length ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">
            Belum ada data navigasi
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Key</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Label (ID)</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Label (EN)</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">Tampil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {items
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <tr key={item.key} className="hover:bg-neutral-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{item.key}</td>
                    <td className="px-5 py-3">
                      <input
                        value={item.label_id}
                        onChange={(e) => updateLabel(item.key, "label_id", e.target.value)}
                        className="w-full rounded border border-neutral-200 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                      />
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      <input
                        value={item.label_en}
                        onChange={(e) => updateLabel(item.key, "label_en", e.target.value)}
                        className="w-full rounded border border-neutral-200 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                      />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleVisible(item.key)}
                        className={`rounded p-1.5 transition-colors ${item.is_visible ? "text-primary hover:bg-primary/8" : "text-neutral-300 hover:bg-neutral-100"}`}
                      >
                        {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
