"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { JobModal } from "@/components/admin/career/JobModal";
import { ApplicationsDrawer } from "@/components/admin/career/ApplicationsDrawer";
import type { ApiResponse, JobListing } from "@/interface/admin.interface";
import dayjs from "dayjs";

export default function AdminCareerPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<JobListing | null | "new">(null);
  const [viewApps, setViewApps] = useState<JobListing | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<JobListing[]>>(
        getApi(endpoints.career.adminList)
      );
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.career.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Lowongan dihapus");
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Karir</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} lowongan</p>
        </div>
        <Button startIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setEditing("new")}>
          Tambah Lowongan
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-neutral-400">Belum ada lowongan</p>
            <button onClick={() => setEditing("new")} className="mt-3 text-sm font-medium text-primary hover:underline">
              Tambah lowongan pertama
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Posisi</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">Departemen</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Deadline</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 lg:table-cell">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((job) => (
                <tr key={job.id} className="hover:bg-neutral-50/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">{job.content.title_id}</p>
                    <p className="text-xs text-neutral-400">{job.location} · {job.employment_type}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-neutral-600 sm:table-cell">{job.department}</td>
                  <td className="hidden px-5 py-4 text-neutral-600 md:table-cell">
                    {job.deadline ? dayjs(job.deadline).format("DD MMM YYYY") : "—"}
                  </td>
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${job.status === "open" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {job.status === "open" ? "Buka" : "Tutup"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewApps(job)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title="Lihat pelamar"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditing(job)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus "${job.content.title_id}"?`)) deleteMutation.mutate(job.id);
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
        <JobModal
          job={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["admin-jobs"] });
            setEditing(null);
          }}
        />
      )}

      {viewApps !== null && (
        <ApplicationsDrawer job={viewApps} onClose={() => setViewApps(null)} />
      )}
    </div>
  );
}
