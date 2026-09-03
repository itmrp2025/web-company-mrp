"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { PageHero } from "@/components/public/layout/PageHero";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { axiosInterceptor } from "@/config/axios.config";
import { toast } from "sonner";
import type { JobListing, ApiResponse } from "@/interface/admin.interface";

export default function CareerDetailPage() {
  const params = useParams<{ locale: string; slug: string }>();
  const locale = useLocale();
  const lang = locale as "id" | "en";
  const t = useTranslations("career");

  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", cover_letter: "", cv_url: "", portfolio_url: "",
  });

  useEffect(() => {
    fetch(getApi(endpoints.career.detail(params.slug)))
      .then((r) => r.ok ? r.json() : null)
      .then((data: ApiResponse<JobListing> | null) => {
        if (data?.data) setJob(data.data);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    try {
      await axiosInterceptor.post(getApi(endpoints.career.apply(job.id)), form);
      toast.success(lang === "id" ? "Lamaran berhasil dikirim!" : "Application submitted!");
      setApplied(true);
    } catch {
      toast.error(lang === "id" ? "Gagal mengirim lamaran." : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) notFound();

  const title = lang === "id" ? job.content.title_id : job.content.title_en;
  const desc = lang === "id" ? job.content.description_id : job.content.description_en;
  const reqs = lang === "id" ? job.content.requirements_id : job.content.requirements_en;
  const reqLines = reqs?.split("\n").filter(Boolean) ?? [];

  return (
    <>
      <PageHero
        badge={job.department || t("badge")}
        heading={title}
        imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop"
        overlay="darker"
      />

      <section className="border-b border-neutral-100 bg-neutral-50 py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
            <Button
              variant="text"
              href="/career"
              color="neutral"
              startIcon={<ArrowLeft className="h-4 w-4" />}
              className="-ml-2 text-neutral-400 hover:text-neutral-700"
            >
              {lang === "id" ? "Karir" : "Career"}
            </Button>
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{job.location}</span>
              </div>
            )}
            {job.employment_type && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{job.employment_type}</span>
              </div>
            )}
            {job.deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{t("deadline")}: {new Date(job.deadline).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Job detail */}
            <div className="lg:col-span-2 space-y-10">
              {desc && (
                <div>
                  <h2 className="mb-4 font-sans text-xl font-semibold text-neutral-900">{t("responsibilities")}</h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                </div>
              )}
              {reqLines.length > 0 && (
                <div>
                  <h2 className="mb-4 font-sans text-xl font-semibold text-neutral-900">{t("requirements")}</h2>
                  <ul className="space-y-2">
                    {reqLines.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                        <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                        {req.replace(/^[-*•]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Apply form */}
            <div className="lg:col-span-1">
              <div className="border border-neutral-100 p-6">
                <h3 className="mb-5 font-sans text-base font-semibold text-neutral-900">
                  {lang === "id" ? "Lamar Posisi Ini" : "Apply for This Position"}
                </h3>
                {applied ? (
                  <div className="text-center py-8">
                    <div className="text-2xl mb-3">✓</div>
                    <p className="text-sm font-medium text-primary">
                      {lang === "id" ? "Lamaran terkirim!" : "Application sent!"}
                    </p>
                    <p className="mt-2 text-xs text-neutral-400">
                      {lang === "id" ? "Kami akan menghubungi Anda segera." : "We will contact you soon."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                      label={lang === "id" ? "Nama Lengkap" : "Full Name"}
                      value={form.full_name}
                      onChange={handleChange("full_name")}
                      required
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      required
                    />
                    <TextField
                      label={lang === "id" ? "Telepon" : "Phone"}
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                    />
                    <TextField
                      label={lang === "id" ? "URL CV/Resume" : "CV/Resume URL"}
                      type="url"
                      value={form.cv_url}
                      onChange={handleChange("cv_url")}
                    />
                    <TextField
                      label={lang === "id" ? "URL Portfolio (opsional)" : "Portfolio URL (optional)"}
                      type="url"
                      value={form.portfolio_url}
                      onChange={handleChange("portfolio_url")}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        {lang === "id" ? "Surat Lamaran" : "Cover Letter"}
                      </label>
                      <textarea
                        value={form.cover_letter}
                        onChange={handleChange("cover_letter")}
                        rows={4}
                        className="border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                        placeholder={lang === "id" ? "Kenapa Anda tertarik bergabung?" : "Why do you want to join?"}
                      />
                    </div>
                    <Button type="submit" loading={submitting} className="w-full justify-center">
                      {lang === "id" ? "Kirim Lamaran" : "Submit Application"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
