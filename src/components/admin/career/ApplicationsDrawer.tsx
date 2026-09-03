"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { X, ExternalLink } from "lucide-react";
import type { ApiResponse, JobApplication, JobListing } from "@/interface/admin.interface";
import dayjs from "dayjs";

const statusOptions = ["new", "reviewing", "interview", "offered", "rejected"];
const statusColor: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  interview: "bg-purple-50 text-purple-700",
  offered: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

interface Props {
  job: JobListing;
  onClose: () => void;
}

export function ApplicationsDrawer({ job, onClose }: Props) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications", job.id],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<JobApplication[]>>(
        getApi(`${endpoints.career.applications}?job_id=${job.id}`)
      );
      return res.data.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      axiosInterceptor.patch(
        getApi(endpoints.career.updateApplicationStatus(appId)),
        { status }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications", job.id] });
      toast.success("Status diperbarui");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Pelamar</h2>
            <p className="text-sm text-neutral-500">{job.content.title_id}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Memuat...</div>
          ) : !data?.length ? (
            <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
              Belum ada pelamar
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {data.map((app) => (
                <div key={app.id} className="px-6 py-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-neutral-900">{app.full_name}</p>
                      <p className="text-sm text-neutral-500">{app.email}</p>
                      {app.phone && <p className="text-sm text-neutral-500">{app.phone}</p>}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus.mutate({ appId: app.id, status: e.target.value })}
                      className={`rounded px-2 py-1 text-xs font-medium border-0 focus:outline-none ${statusColor[app.status] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-white text-neutral-900 capitalize">{s}</option>
                      ))}
                    </select>
                  </div>

                  {app.cover_letter && (
                    <p className="mb-3 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {app.cover_letter}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {app.cv_url && (
                      <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:border-primary hover:text-primary transition-colors">
                        <ExternalLink className="h-3 w-3" /> CV
                      </a>
                    )}
                    {app.portfolio_url && (
                      <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:border-primary hover:text-primary transition-colors">
                        <ExternalLink className="h-3 w-3" /> Portfolio
                      </a>
                    )}
                    <span className="ml-auto text-xs text-neutral-400">
                      {dayjs(app.created_at).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
