import { useTranslations } from "next-intl";
import { Button } from "@/components/custom-ui/Button";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary-50 to-white px-6 text-center">
      <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
        {t("badge")}
      </span>
      <h1 className="max-w-3xl text-4xl md:text-5xl">{t("heading")}</h1>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="contained" size="lg">
          {t("cta_primary")}
        </Button>
        <Button variant="outlined" size="lg">
          {t("cta_secondary")}
        </Button>
      </div>
    </section>
  );
}
