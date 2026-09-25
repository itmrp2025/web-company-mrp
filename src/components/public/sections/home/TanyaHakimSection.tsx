import { useTranslations } from "next-intl";
import { Scale, MessageCircle, ArrowRight } from "lucide-react";

export function TanyaHakimPromoSection() {
  const t = useTranslations("common");

  return (
    <section className="bg-primary py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-white/15 bg-white/6 px-6 py-8 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-semibold text-white sm:text-xl">
                {t("tanya_hakim_title")}
              </h3>
              <p className="mt-1 max-w-md text-sm text-white/75 leading-relaxed">
                {t("tanya_hakim_desc")}
              </p>
            </div>
          </div>

          <a
            href="https://tanyahakim.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            <MessageCircle className="h-4 w-4" />
            {t("tanya_hakim_cta_button")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}