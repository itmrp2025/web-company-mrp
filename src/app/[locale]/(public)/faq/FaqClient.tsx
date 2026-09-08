"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/custom-ui/Button";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import type { ApiResponse } from "@/interface/admin.interface";

interface FAQ {
  id: string;
  category: string;
  order_index: number;
  is_visible: boolean;
  content: {
    id: { question: string; answer: string };
    en: { question: string; answer: string };
  };
}

const categoryKeys = ["general", "consultation", "fees", "process", "confidentiality"] as const;

interface Props {
  locale: string;
  contactPrompt: string;
  contactDesc: string;
  contactCta: string;
}

export function FaqClient({ locale, contactPrompt, contactDesc, contactCta }: Props) {
  const t = useTranslations("faq");
  const lang = locale as "id" | "en";

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch(getApi(endpoints.faq.list))
      .then((r) => r.ok ? r.json() : null)
      .then((data: ApiResponse<FAQ[]> | null) => {
        if (data?.data) setFaqs(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  const availableCategories = categoryKeys.filter((key) =>
    faqs.some((f) => f.category === key)
  );

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Category filter */}
        <div className="mb-8 flex gap-0 border-b border-neutral-100 overflow-x-auto">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors",
              activeCategory === "all"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            )}
          >
            {t("all_categories")}
          </button>
          {availableCategories.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors",
                activeCategory === key
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              )}
            >
              {t(`categories.${key}`)}
            </button>
          ))}
        </div>

        {/* Accordion */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse border-b border-neutral-100 py-5">
                <div className="h-4 w-3/4 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-neutral-400">{t("no_results")}</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((faq) => {
              const isOpen = openId === faq.id;
              const q = faq.content?.[lang]?.question ?? "";
              const a = faq.content?.[lang]?.answer ?? "";
              return (
                <div key={faq.id}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-medium text-neutral-900 text-sm leading-relaxed">{q}</span>
                    <ChevronDown className={cn("mt-0.5 h-5 w-5 shrink-0 text-neutral-400 transition-transform", isOpen && "rotate-180 text-primary")} />
                  </button>
                  {isOpen && (
                    <div className="pb-5">
                      <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact prompt */}
        <div className="mt-12 border border-neutral-100 p-8 text-center">
          <p className="mb-2 font-sans text-lg font-medium text-neutral-900">{contactPrompt}</p>
          <p className="mb-6 text-sm text-neutral-500">{contactDesc}</p>
          <Button href="/contact" endIcon={<ArrowRight className="h-4 w-4" />}>
            {contactCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
