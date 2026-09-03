"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === "id" ? "en" : "id";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "id" ? "EN" : "ID"}</span>
    </button>
  );
}
