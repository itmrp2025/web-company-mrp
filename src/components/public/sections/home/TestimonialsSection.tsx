"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function ReviewCardContent({
  review,
  lang,
  tone = "white",
}: {
  review: Review;
  lang: "id" | "en";
  tone?: "white" | "tinted";
}) {
  const text = lang === "en" && review.review_text_en ? review.review_text_en : review.review_text;
  const initial = review.client_name?.charAt(0)?.toUpperCase() ?? "?";
  const tinted = tone === "tinted";


   return (
    <div
      className={`flex h-full flex-col p-8 sm:p-10 shadow-sm ${
        tinted
          ? "bg-linear-to-br from-primary/15 via-primary/5 to-white border border-primary/20"
          : "bg-white"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <Quote className="h-7 w-7 text-primary/25" />
        <Stars rating={review.rating} />
      </div>
      <p className="flex-1 text-[0.9rem] text-neutral-600 leading-relaxed italic">
        &ldquo;{text}&rdquo;
      </p>
      <div
        className={`mt-8 flex items-center gap-3.5 pt-6 border-t ${
          tinted ? "border-primary/15" : "border-neutral-100"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-white text-sm font-semibold font-sans">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-neutral-900 text-sm leading-tight">{review.client_name}</p>
          {review.client_company && (
            <p className="text-xs text-neutral-400 mt-0.5">{review.client_company}</p>
          )}
          {review.service_type && (
            <p className="text-[10px] text-primary/70 mt-0.5 uppercase tracking-wide font-medium">
              {review.service_type}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**Stacked card carousel — khusus mobile.**/
function StackedReviewCarousel({
  reviews,
  lang,
  header,
}: {
  reviews: Review[];
  lang: "id" | "en";
  header: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  const n = reviews.length;

  const update = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;
    setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  const cursor = progress * (n - 1);

  return (
    <div
      ref={wrapperRef}
      className="relative sm:hidden"
      style={{ height: `${100 + (n - 1) * 70}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-clip pt-16">
        {header}

        <div className="relative mt-8 h-105 w-full">
          {reviews.map((review, i) => {
            const enter = i === 0 ? 1 : Math.min(1, Math.max(0, cursor - (i - 1)));
            const covered = cursor - i >= 1;

            return (
              <div
                key={review.id}
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: `translateY(${(1 - enter) * 100}svh)`,
                  opacity: covered ? 0 : 1,
                  zIndex: i + 1,
                }}
              >
                <div className="h-full shadow-lg">
                  <ReviewCardContent review={review} lang={lang} tone="tinted" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
    fetch(getApi(`${endpoints.reviews.list}?limit=6`))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<Review[]> | null) => {
        if (data?.data?.length) setReviews(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  const headerEl = (
    <div className="px-4 text-center">
      <p className="section-label mb-4">{badge}</p>
      <h2 className="mx-auto max-w-xl text-neutral-900">{heading}</h2>
      <p className="mx-auto mt-4 max-w-lg text-neutral-500 leading-relaxed">
        {subheading}
      </p>
    </div>
  );

  return (
    <section className="bg-neutral-50 py-0 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop/tablet: header biasa */}
        <div className="mb-16 hidden sm:block">{headerEl}</div>

        {/* Skeleton */}
        {loading && (
          <div className="py-16 sm:py-0">
            <div className="mb-8 sm:hidden">{headerEl}</div>
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
          </div>
        )}

        {/* Mobile: pinned stacked cards (header ikut di dalam panel sticky) */}
        {!loading && reviews.length > 0 && (
          <StackedReviewCarousel reviews={reviews} lang={lang} header={headerEl} />
        )}

        {/* Tablet/desktop: grid seperti semula */}
        {!loading && reviews.length > 0 && (
          <div className="hidden gap-px bg-neutral-200 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCardContent key={review.id} review={review} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}