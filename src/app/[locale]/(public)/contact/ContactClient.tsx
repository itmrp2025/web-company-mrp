"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { TextField } from "@/components/custom-ui/TextField";
import { Button } from "@/components/custom-ui/Button";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { toast } from "sonner";
import { PolicyModal } from "@/components/public/PolicyModal";

const serviceOptionKeys = [
  "litigation", "corporate", "regulatory", "property", "family", "employment", "other",
] as const;

interface Props {
  locale: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
}

export function ContactClient({
  locale,
  phone,
  whatsapp,
  email,
  address,
  hoursWeekday,
  hoursSaturday,
  hoursSunday,
}: Props) {
  const t = useTranslations("contact");
  const tSvc = useTranslations("services");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", service: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [modalSlug, setModalSlug] = useState<"privacy-policy" | "terms-conditions" | null>(null);
  const [policyError, setPolicyError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!policyAgreed) {
      const msg = locale === "id"
        ? "Anda harus menyetujui Kebijakan Privasi dan Syarat & Ketentuan."
        : "You must agree to the Privacy Policy and Terms & Conditions.";
      setPolicyError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      await axiosInterceptor.post(getApi("/contact"), {
        form_type: "contact",
        ...form,
      });
      toast.success(t("success"));
      // ponytail: open wa.me link with message summary; upgrade to WA Business API when backend supports it
      const waNumber = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_NUMBER;
      if (waNumber) {
        const waText = [
          `[Contact Form — ${form.name}]`,
          `Email: ${form.email}`,
          form.phone ? `Phone: ${form.phone}` : "",
          `Subject: ${form.subject}`,
          form.service ? `Service: ${form.service}` : "",
          `Message: ${form.message}`,
        ].filter(Boolean).join("\n");
        window.open(
          `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`,
          "_blank",
        );
      }
      setForm({ name: "", email: "", phone: "", subject: "", service: "", message: "" });
      setPolicyAgreed(false);
      setPolicyError(null);
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {/* Info */}
          <div className="space-y-6">
            <div className="border border-neutral-100 p-6">
              <p className="section-label mb-4">
                {locale === "id" ? "Informasi Kontak" : "Contact Information"}
              </p>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, label: t("address"), value: address, href: undefined },
                  { Icon: Phone, label: t("phone_label"), value: phone, href: `tel:${phone.replace(/[\s()+-]/g, "")}` },
                  { Icon: Mail, label: t("email_label"), value: email, href: `mailto:${email}` },
                  { Icon: MessageSquare, label: t("whatsapp"), value: whatsapp, href: `https://wa.me/${whatsapp.replace(/[\s()+-]/g, "")}` },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-neutral-700 hover:text-primary transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-neutral-700">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-neutral-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <p className="section-label">{t("office_hours")}</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { schedule: hoursWeekday, muted: false },
                  { schedule: hoursSaturday, muted: false },
                  { schedule: hoursSunday, muted: true },
                ].map(({ schedule, muted }, i) => {
                  const [day, ...rest] = schedule.split(", ");
                  const hours = rest.join(", ");
                  return (
                    <div key={i} className="flex justify-between">
                      <span className={muted ? "text-neutral-400" : "text-neutral-600"}>{day}</span>
                      <span className={muted ? "text-neutral-400" : "font-medium text-neutral-700"}>{hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="font-sans text-2xl font-semibold text-neutral-900 mb-8">{t("form_heading")}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField label={t("name")} value={form.name} onChange={handleChange("name")} required />
                <TextField label={t("email")} type="email" value={form.email} onChange={handleChange("email")} required />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField label={t("phone")} type="tel" value={form.phone} onChange={handleChange("phone")} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">{t("service")}</label>
                  <select
                    value={form.service}
                    onChange={handleChange("service")}
                    className="h-10 border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">{locale === "id" ? "Pilih layanan..." : "Select service..."}</option>
                    {serviceOptionKeys.map((key) => (
                      <option key={key} value={key}>
                        {key === "other"
                          ? (locale === "id" ? "Lainnya" : "Other")
                          : tSvc(`items.${key}.name`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <TextField label={t("subject")} value={form.subject} onChange={handleChange("subject")} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">{t("message")}</label>
                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  required
                  rows={5}
                  className="border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder={locale === "id" ? "Ceritakan kebutuhan hukum Anda..." : "Tell us about your legal needs..."}
                />
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAgreed}
                    onChange={(e) => {
                      setPolicyAgreed(e.target.checked);
                      if (e.target.checked) setPolicyError(null);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className="leading-relaxed">
                    {locale === "id" ? "Saya telah membaca dan menyetujui " : "I have read and agree to the "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalSlug("privacy-policy");
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      [{locale === "id" ? "Kebijakan Privasi" : "Privacy Policy"}]
                    </button>
                    {" "}{locale === "id" ? "dan" : "and"}{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalSlug("terms-conditions");
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      [{locale === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}]
                    </button>
                  </span>
                </label>
                {policyError && <p className="text-xs text-red-500 font-medium ml-6.5">{policyError}</p>}
              </div>

              <Button type="submit" loading={loading} size="lg" disabled={!policyAgreed || loading}>
                {t("submit")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {modalSlug && (
        <PolicyModal
          slug={modalSlug}
          open={!!modalSlug}
          onOpenChange={(open) => {
            if (!open) setModalSlug(null);
          }}
          onAgree={() => {
            setPolicyAgreed(true);
            setPolicyError(null);
          }}
        />
      )}
    </section>
  );
}
