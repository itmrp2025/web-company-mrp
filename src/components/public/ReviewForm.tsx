"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { TextField } from "@/components/custom-ui/TextField";
import { Button } from "@/components/custom-ui/Button";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";

const serviceOptionKeys = [
  "litigation", "corporate", "regulatory", "property", "family", "employment", "other",
] as const;

const emptyForm = {
  client_name: "",
  client_company: "",
  service_type: "",
  rating: 0,
  review_text: "",
};

export function ReviewForm() {
  const t = useTranslations("reviewForm");
  const tSvc = useTranslations("services");

  const [form, setForm] = useState(emptyForm);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Backend menolak rating di luar 1–5; cegah lebih awal agar pengguna
    // dapat pesan yang jelas alih-alih error dari server.
    if (form.rating < 1) {
      toast.error(t("rating_required"));
      return;
    }

    setLoading(true);
    try {
      await axiosInterceptor.post(getApi(endpoints.reviews.submit), form);
      toast.success(t("success"));
      setForm(emptyForm);
      setHoverRating(0);
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const activeRating = hoverRating || form.rating;

  return (
    <section className="border-t border-neutral-100 bg-neutral-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
            <MessageSquareQuote className="h-6 w-6 text-primary" />
          </div>
          <p className="section-label mb-3">{t("badge")}</p>
          <h2 className="font-sans text-2xl font-semibold text-neutral-900 sm:text-3xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-500 leading-relaxed">
            {t("subheading")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label={t("name")}
              required
              value={form.client_name}
              onChange={handleChange("client_name")}
              placeholder={t("name_placeholder")}
            />
            <TextField
              label={t("company")}
              value={form.client_company}
              onChange={handleChange("client_company")}
              placeholder={t("company_placeholder")}
            />
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              {t("service")}
            </label>
            <select
              value={form.service_type}
              onChange={handleChange("service_type")}
              className="h-10 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              <option value="">{t("service_placeholder")}</option>
              {serviceOptionKeys.map((key) =>
                key === "other" ? (
                  <option key={key} value={key}>
                    {t("service_other")}
                  </option>
                ) : (
                  <option key={key} value={key}>
                    {tSvc(`items.${key}.name` as Parameters<typeof tSvc>[0])}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              {t("rating")} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={t("rating_star", { count: value })}
                  onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                  onMouseEnter={() => setHoverRating(value)}
                  className="rounded p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      value <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              {t("review")} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              maxLength={2000}
              value={form.review_text}
              onChange={handleChange("review_text")}
              placeholder={t("review_placeholder")}
              className="resize-none rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            />
            <p className="text-right text-xs text-neutral-400">
              {form.review_text.length}/2000
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">{t("moderation_note")}</p>
            <Button type="submit" loading={loading} className="shrink-0">
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
