"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { ServiceModal } from "@/components/admin/services/ServiceModal";
import type { ApiResponse, Service } from "@/interface/admin.interface";

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null | "new">(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Service[]>>(
        getApi(endpoints.services.adminList)
      );
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.services.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Layanan dihapus");
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Layanan</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} layanan</p>
        </div>
        <Button startIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setEditing("new")}>
          Tambah Layanan
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-neutral-400">Belum ada layanan</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Nama Layanan</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">Slug</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((service) => (
                <tr key={service.id} className="hover:bg-neutral-50/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">{service.content.name_id}</p>
                    <p className="text-xs text-neutral-400 line-clamp-1">{service.content.short_desc_id}</p>
                  </td>
                  <td className="hidden px-5 py-4 font-mono text-xs text-neutral-500 sm:table-cell">
                    {service.slug}
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${service.is_active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {service.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                    {service.is_featured && (
                      <span className="ml-1.5 inline-flex rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Unggulan
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(service)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus layanan "${service.content.name_id}"?`)) deleteMutation.mutate(service.id);
                        }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <ServiceModal
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["admin-services"] });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
