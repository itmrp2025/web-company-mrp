"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { useAuthStore } from "@/store/use-auth";
import { FileText, Users, Briefcase, Star, TrendingUp, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ApiResponse, AnalyticsOverview, Article, Review } from "@/interface/admin.interface";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href?: string;
  sub?: string;
}) {
  const inner = (
    <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-5 transition-shadow hover:shadow-sm">
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
  if (href) return <Link href={href as Parameters<typeof Link>[0]["href"]}>{inner}</Link>;
  return inner;
}

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<AnalyticsOverview>>(
        getApi(endpoints.analytics.overview)
      );
      return res.data.data;
    },
  });

  const { data: articlesData } = useQuery({
    queryKey: ["admin-articles-count"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Article[]>>(
        getApi(endpoints.articles.adminList)
      );
      return res.data;
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["admin-reviews-pending"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Review[]>>(
        getApi(endpoints.reviews.adminList)
      );
      return res.data.data?.filter((r) => r.status === "pending") ?? [];
    },
  });

  const totalArticles = articlesData?.meta?.total ?? articlesData?.data?.length ?? 0;
  const publishedArticles = articlesData?.data?.filter((a) => a.status === "published").length ?? 0;
  const pendingReviews = reviewsData?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Selamat datang, {user?.name ?? "Admin"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Artikel"
          value={totalArticles}
          icon={FileText}
          href="/admin/articles"
          sub={`${publishedArticles} dipublikasikan`}
        />
        <StatCard
          label="Ulasan Pending"
          value={pendingReviews}
          icon={Star}
          href="/admin/reviews"
          sub="Menunggu persetujuan"
        />
        <StatCard
          label="Total Pageviews"
          value={analytics?.total_pageviews?.toLocaleString() ?? "—"}
          icon={TrendingUp}
        />
        <StatCard
          label="Form Masuk"
          value={analytics?.total_form_submissions?.toLocaleString() ?? "—"}
          icon={Users}
        />
      </div>

      {/* Quick links */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">Akses Cepat</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/admin/articles/new", label: "Tulis Artikel", icon: FileText },
            { href: "/admin/team", label: "Kelola Tim", icon: Users },
            { href: "/admin/services", label: "Kelola Layanan", icon: Briefcase },
            { href: "/admin/reviews", label: "Ulasan", icon: Star },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href as Parameters<typeof Link>[0]["href"]}
              className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-primary/20 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Top pages */}
      {analytics?.top_pages && analytics.top_pages.length > 0 && (
        <div className="rounded-lg border border-neutral-100 bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4">
            <Clock className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-700">Halaman Terpopuler</h2>
          </div>
          <div className="divide-y divide-neutral-50">
            {analytics.top_pages.slice(0, 5).map((p) => (
              <div key={p.path} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-neutral-700 font-mono">{p.path}</span>
                <span className="text-sm font-semibold text-neutral-900">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
