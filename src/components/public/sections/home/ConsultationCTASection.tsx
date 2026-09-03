import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";
import { Phone, MessageSquare } from "lucide-react";
import { cms } from "@/utils/helpers/fetchCmsPage";

interface Props {
  content?: Record<string, string>;
  locale?: string;
}

export function ConsultationCTASection({ content = {}, locale = "id" }: Props) {
  const t = useTranslations("cta");
  const lang = locale as "id" | "en";

  const badge = cms(content, `badge_${lang}`, t("badge"));
  const heading = cms(content, `heading_${lang}`, t("heading"));
  const subheading = cms(content, `subheading_${lang}`, t("subheading"));
  const ctaLabel = cms(content, `cta_label_${lang}`, t("primary"));
  const phone = cms(content, "phone", "(+62) 21 50300825");

  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="relative py-20 sm:py-24 text-white overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gedung.webp')", backgroundAttachment: "fixed" }}
      />
      <div className="absolute inset-0 bg-neutral-950/75" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label mb-4 text-neutral-400">{badge}</p>
          <h2 className="mb-5 text-white">{heading}</h2>
          <p className="mb-10 text-neutral-400 leading-relaxed">{subheading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              color="accent"
              size="lg"
              href="/contact"
              startIcon={<MessageSquare className="h-4 w-4" />}
              className="px-8"
            >
              {ctaLabel}
            </Button>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/8 hover:border-white/30"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
