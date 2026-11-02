"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { readingTimeMinutes } from "@/utils/helpers/readingTime";
import type { Article, ArticleCategory, ApiResponse } from "@/interface/admin.interface";

const PER_PAGE = 8;

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - windowSize && p <= page + windowSize)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-sm text-neutral-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center border text-sm font-medium transition-colors ${
              p === page
                ? "border-primary bg-primary text-white"
                : "border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

type FeaturedVariant = "large" | "small" | "wide";

function FeaturedCard({
  article,
  lang,
  locale,
  variant,
  badgeLabel,
  readTimeLabel,
}: {
  article: Article;
  lang: "id" | "en";
  locale: string;
  variant: FeaturedVariant;
  badgeLabel: string;
  readTimeLabel: string;
}) {
  const title = lang === "id" ? article.content.title_id : article.content.title_en;
  const excerpt = lang === "id" ? article.content.excerpt_id : article.content.excerpt_en;
  const body = lang === "id" ? article.content.body_id : article.content.body_en;
  const catName = article.category
    ? lang === "id"
      ? article.category.content.id.name
      : article.category.content.en.name
    : "";
  const isSmall = variant === "small";

  const wrapperCls = {
    large: "flex-col",
    wide: "flex-col lg:flex-row",
    small: "flex-col sm:flex-row flex-1",
  }[variant];

  const imageCls = {
    large: "aspect-video",
    wide: "aspect-video lg:aspect-auto lg:min-h-[320px] lg:w-1/2 lg:shrink-0",
    small: "h-44 sm:h-auto sm:min-h-[9rem] sm:w-2/5 sm:shrink-0",
  }[variant];

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group flex overflow-hidden border border-neutral-100 bg-white transition-colors hover:border-primary/20 ${wrapperCls}`}
    >
      <div className={`relative overflow-hidden bg-neutral-100 ${imageCls}`}>
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 bg-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
          <Star className="h-3 w-3 fill-current" />
          {badgeLabel}
        </span>
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Tag className="h-10 w-10 text-neutral-300" />
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${isSmall ? "p-5" : "p-6 lg:p-8"}`}>
        {catName && <span className="section-label mb-3">{catName}</span>}
        <h3
          className={`mb-3 font-sans font-semibold text-neutral-900 transition-colors group-hover:text-primary ${
            isSmall ? "text-base line-clamp-3" : "text-xl lg:text-2xl line-clamp-3"
          }`}
        >
          {title}
        </h3>
        {!isSmall && excerpt && (
          <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-50 pt-4 text-xs text-neutral-400">
          {article.published_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(article.published_at, locale)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {readingTimeMinutes(body)} {readTimeLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArticlesClient({ locale }: { locale: string }) {
  const t = useTranslations("articles");
  const lang = locale as "id" | "en";

  const [articles, setArticles] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all"); // slug, bukan id
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  // Kategori cuma perlu di-fetch sekali
  useEffect(() => {
    fetch(getApi(endpoints.articles.categories))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<ArticleCategory[]> | null) => {
        setCategories(data?.data ?? []);
      })
      .catch(() => {});
  }, []);

  // Artikel unggulan juga cukup di-fetch sekali
  useEffect(() => {
    fetch(getApi(`${endpoints.articles.list}?featured=true&per_page=3`))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<Article[]> | null) => {
        setFeatured((data?.data ?? []).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const fetchArticles = useCallback(async (targetPage: number, category: string) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        per_page: String(PER_PAGE),
      });
      if (category !== "all") {
        params.set("category", category);
      } else {
        // Tanpa filter kategori, artikel unggulan sudah tampil di section atas
        params.set("featured", "false");
      }

      const res = await fetch(getApi(`${endpoints.articles.list}?${params.toString()}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse<Article[]> = await res.json();
      if (id !== requestId.current) return; // sudah ada request yang lebih baru
      setArticles(data.data ?? []);
      setTotalPages(data.meta?.total_pages ?? 1);
    } catch {
      if (id !== requestId.current) return;
      setArticles([]);
      setTotalPages(1);
      setError(true);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Fetch awal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles(1, "all");
  }, [fetchArticles]);

  const handleCategoryChange = (slug: string) => {
    if (slug === activeCategory) return;
    setActiveCategory(slug);
    setPage(1);
    fetchArticles(1, slug);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchArticles(p, activeCategory);
  };

  const showFeatured = activeCategory === "all" && page === 1 && featured.length > 0;

  return (
    <>
      {/* Category filter */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            <button
              onClick={() => handleCategoryChange("all")}
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
                onClick={() => handleCategoryChange(cat.slug)}
                className={`shrink-0 border-b-2 px-5 py-3.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === cat.slug
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

      {/* Artikel Unggulan */}
      {showFeatured && (
        <section className="bg-white pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-neutral-900">{t("featured_title")}</h2>
            {featured.length > 1 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <FeaturedCard
                  article={featured[0]}
                  lang={lang}
                  locale={locale}
                  variant="large"
                  badgeLabel={t("featured_badge")}
                  readTimeLabel={t("read_time")}
                />
                <div className="flex flex-col gap-8">
                  {featured.slice(1).map((a) => (
                    <FeaturedCard
                      key={a.id}
                      article={a}
                      lang={lang}
                      locale={locale}
                      variant="small"
                      badgeLabel={t("featured_badge")}
                      readTimeLabel={t("read_time")}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <FeaturedCard
                article={featured[0]}
                lang={lang}
                locale={locale}
                variant="wide"
                badgeLabel={t("featured_badge")}
                readTimeLabel={t("read_time")}
              />
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showFeatured && <h2 className="mb-8 text-neutral-900">{t("all_title")}</h2>}

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
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
          ) : error ? (
            <p className="py-20 text-center text-neutral-400">{t("load_error")}</p>
          ) : articles.length === 0 ? (
            // Kalau semua artikel ternyata unggulan, section di atas sudah cukup
            showFeatured ? null : (
              <p className="py-20 text-center text-neutral-400">{t("no_results")}</p>
            )
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
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
                        {/* Di hasil filter kategori, artikel unggulan ikut muncul dan diberi lencana */}
                        {article.is_featured && (
                          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 bg-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                            <Star className="h-3 w-3 fill-current" />
                            {t("featured_badge")}
                          </span>
                        )}
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
                              {readingTimeMinutes(lang === "id" ? article.content.body_id : article.content.body_en)}{" "}
                              {t("read_time")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </div>
      </section>
    </>
  );
}