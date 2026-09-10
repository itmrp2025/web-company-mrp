"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Quote, Star } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { cms } from "@/utils/helpers/fetchCmsPage";
import type { Review, ApiResponse } from "@/interface/admin.interface";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({ content = {} }: { content?: Record<string, string> }) {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const lang = locale as "id" | "en";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Endpoint publik hanya mengembalikan yang sudah disetujui, dan limit
    // kini dibatasi di server — tidak perlu memotong lagi di sini.
    fetch(getApi(`${endpoints.reviews.list}?limit=6`))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<Review[]> | null) => {
        if (data?.data?.length) setReviews(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-4">{badge}</p>
          <h2 className="mx-auto max-w-xl text-neutral-900">{heading}</h2>
          <p className="mx-auto mt-4 max-w-lg text-neutral-500 leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 animate-pulse">
                <div className="mb-6 h-8 w-8 rounded bg-neutral-100" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-neutral-100 rounded" />
                  <div className="h-3 w-4/5 bg-neutral-100 rounded" />
                  <div className="h-3 w-3/5 bg-neutral-100 rounded" />
                </div>
                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-neutral-100">
                  <div className="h-11 w-11 shrink-0 bg-neutral-100 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 bg-neutral-100 rounded" />
                    <div className="h-2.5 w-16 bg-neutral-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => {
              const text = lang === "en" && review.review_text_en
                ? review.review_text_en
                : review.review_text;
              const initial = review.client_name?.charAt(0)?.toUpperCase() ?? "?";

              return (
                <div key={review.id} className="bg-white p-8 sm:p-10 flex flex-col">
                  <div className="mb-5 flex items-center justify-between">
                    <Quote className="h-7 w-7 text-primary/25" />
                    <Stars rating={review.rating} />
                  </div>
                  <p className="flex-1 text-[0.9rem] text-neutral-600 leading-relaxed italic">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-3.5 pt-6 border-t border-neutral-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-white text-sm font-semibold font-sans">
                      {initial}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm leading-tight">{review.client_name}</p>
                      {review.client_company && (
                        <p className="text-xs text-neutral-400 mt-0.5">{review.client_company}</p>
                      )}
                      {review.service_type && (
                        <p className="text-[10px] text-primary/70 mt-0.5 uppercase tracking-wide font-medium">{review.service_type}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
