"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { cms } from "@/utils/helpers/fetchCmsPage";
import type { Article, ApiResponse } from "@/interface/admin.interface";

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

interface Props {
  content?: Record<string, string>;
}

export function RecentArticlesSection({ content = {} }: Props) {
  const t = useTranslations("recentArticles");
  const locale = useLocale();
  const lang = locale as "id" | "en";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApi(`${endpoints.articles.list}?status=published&limit=3`))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<Article[]> | null) => {
        if (data?.data) setArticles(data.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label mb-4">{cms(content, `badge_${lang}`, t("badge"))}</p>
            <h2 className="text-neutral-900">{cms(content, `heading_${lang}`, t("heading"))}</h2>
            <p className="mt-4 max-w-lg text-neutral-500 leading-relaxed">{cms(content, `subheading_${lang}`, t("subheading"))}</p>
          </div>
          <Button
            variant="outlined"
            color="neutral"
            href="/articles"
            endIcon={<ArrowRight className="h-4 w-4" />}
            className="shrink-0 self-start sm:self-auto"
          >
            {cms(content, `view_all_${lang}`, t("viewAll"))}
          </Button>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-neutral-100 animate-pulse">
                <div className="aspect-[16/9] bg-neutral-100" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 bg-neutral-100 rounded" />
                  <div className="h-4 w-full bg-neutral-100 rounded" />
                  <div className="h-4 w-3/4 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles */}
        {!loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = lang === "id" ? article.content.title_id : article.content.title_en;
              const excerpt = lang === "id" ? article.content.excerpt_id : article.content.excerpt_en;
              const body = lang === "id" ? article.content.body_id : article.content.body_en;
              const catName = article.category
                ? (lang === "id" ? article.category.content.id.name : article.category.content.en.name)
                : null;
              const mins = readingTime(body);

              return (
                <a
                  key={article.id}
                  href={`/${locale}/articles/${article.slug}`}
                  className="group flex flex-col border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                    {article.featured_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.featured_image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-50">
                        <Newspaper className="h-10 w-10 text-neutral-200" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      {catName && (
                        <span className="border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary truncate">
                          {catName}
                        </span>
                      )}
                      {article.published_at && (
                        <span className="shrink-0 text-xs text-neutral-400">
                          {formatDate(article.published_at, locale)}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 flex-1 text-base font-semibold text-neutral-900 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {title}
                    </h3>

                    {excerpt && (
                      <p className="mb-4 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock className="h-3.5 w-3.5" />
                        {mins} {cms(content, `min_read_${lang}`, t("minRead"))}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                        {cms(content, `read_more_${lang}`, t("readMore"))} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
