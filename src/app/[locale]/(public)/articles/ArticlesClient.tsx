"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, Tag } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { readingTimeMinutes } from "@/utils/helpers/readingTime";
import type { Article, ArticleCategory, ApiResponse } from "@/interface/admin.interface";

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function ArticlesClient({ locale }: { locale: string }) {
  const t = useTranslations("articles");
  const lang = locale as "id" | "en";

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, catRes] = await Promise.all([
          fetch(getApi(endpoints.articles.list)),
          fetch(getApi(endpoints.articles.categories)),
        ]);
        if (artRes.ok) {
          const data: ApiResponse<Article[]> = await artRes.json();
          setArticles((data.data ?? []).filter((a) => a.status === "published"));
        }
        if (catRes.ok) {
          const data: ApiResponse<ArticleCategory[]> = await catRes.json();
          setCategories(data.data ?? []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.category_id === activeCategory);

  return (
    <>
      {/* Category filter */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 border-b-2 px-5 py-3.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeCategory === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {t("all_categories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 border-b-2 px-5 py-3.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === cat.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {lang === "id" ? cat.content.id.name : cat.content.en.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-neutral-100 bg-white overflow-hidden">
                  <div className="h-48 bg-neutral-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 bg-neutral-100 rounded" />
                    <div className="h-5 bg-neutral-100 rounded" />
                    <div className="h-5 w-4/5 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-neutral-400">{t("no_results")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => {
                const title = lang === "id" ? article.content.title_id : article.content.title_en;
                const excerpt = lang === "id" ? article.content.excerpt_id : article.content.excerpt_en;
                const catName = article.category
                  ? (lang === "id" ? article.category.content.id.name : article.category.content.en.name)
                  : "";
                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col border border-neutral-100 bg-white transition-colors hover:border-primary/20 overflow-hidden"
                  >
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      {article.featured_image ? (
                        <Image
                          src={article.featured_image}
                          alt={title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Tag className="h-10 w-10 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {catName && <span className="section-label mb-3">{catName}</span>}
                      <h3 className="mb-3 flex-1 font-sans text-base font-semibold text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="mb-5 text-sm text-neutral-500 leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-50 pt-4">
                        {article.published_at && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(article.published_at, locale)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {readingTimeMinutes(
                              lang === "id"
                                ? article.content.body_id
                                : article.content.body_en,
                            )}{" "}
                            {t("read_time")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
