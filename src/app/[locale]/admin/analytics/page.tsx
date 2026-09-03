"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { TrendingUp, Users, FileText, Eye } from "lucide-react";
import type { ApiResponse, AnalyticsOverview, FormSubmission } from "@/interface/admin.interface";
import dayjs from "dayjs";

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["admin-analytics-overview"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<AnalyticsOverview>>(
        getApi(endpoints.analytics.overview)
      );
      return res.data.data;
    },
  });

  const { data: submissions, isLoading: loadingSubmissions } = useQuery({
    queryKey: ["admin-form-submissions"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<FormSubmission[]>>(
        getApi(endpoints.analytics.formSubmissions)
      );
      return res.data.data;
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Analitik</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Ringkasan performa website</p>
      </div>

      {loadingOverview ? (
        <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total Pageviews"
              value={overview?.total_pageviews?.toLocaleString() ?? "—"}
              icon={Eye}
            />
            <StatCard
              label="Pengunjung Unik"
              value={overview?.unique_visitors?.toLocaleString() ?? "—"}
              icon={Users}
            />
            <StatCard
              label="Form Masuk"
              value={overview?.total_form_submissions?.toLocaleString() ?? "—"}
              icon={FileText}
            />
          </div>

          {/* Top pages */}
          {overview?.top_pages && overview.top_pages.length > 0 && (
            <div className="mb-8 rounded-lg border border-neutral-100 bg-white">
              <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4">
                <TrendingUp className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-700">Halaman Terpopuler</h2>
              </div>
              <div className="divide-y divide-neutral-50">
                {overview.top_pages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-4 px-5 py-3">
                    <span className="w-5 text-xs font-semibold text-neutral-400">{i + 1}</span>
                    <span className="flex-1 font-mono text-sm text-neutral-700">{p.path}</span>
                    <span className="text-sm font-semibold text-neutral-900">{p.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Form submissions */}
      <div className="rounded-lg border border-neutral-100 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-700">Pengiriman Form Terbaru</h2>
        </div>
        {loadingSubmissions ? (
          <div className="flex items-center justify-center py-10 text-sm text-neutral-400">Memuat...</div>
        ) : !submissions?.length ? (
          <div className="flex items-center justify-center py-10 text-sm text-neutral-400">Belum ada pengiriman form</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Tipe</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Halaman Asal</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {submissions.slice(0, 20).map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50/50">
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 capitalize">
                      {s.form_type}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 font-mono text-xs text-neutral-500 md:table-cell">{s.source_page || "—"}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {dayjs(s.created_at).format("DD MMM YYYY, HH:mm")}
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
