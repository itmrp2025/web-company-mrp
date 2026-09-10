import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  const t = useTranslations("navigation");

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo-mrp.png"
                alt="MRP Law Office"
                width={40}
                height={40}
                className="object-contain brightness-0 invert opacity-80"
              />
              <div className="leading-none">
                <p className="font-sans text-sm font-semibold text-white leading-tight">MRP Law Office</p>
                <p className="text-[10px] tracking-[0.12em] uppercase text-neutral-500 mt-0.5">Advocates & Consultants</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">{t("footerTagline")}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              {t("footerNav")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: "home" as const, href: "/" },
                { key: "about" as const, href: "/about" },
                { key: "services" as const, href: "/services" },
                { key: "team" as const, href: "/our-team" },
                { key: "gallery" as const, href: "/gallery" },
                { key: "articles" as const, href: "/articles" },
              ].map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              {t("footerMore")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: "career" as const, href: "/career" },
                { key: "contact" as const, href: "/contact" },
              ].map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://tanyahakim.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {t("tanyaHakim")}
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  {t("footerPrivacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  {t("footerTerms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              {t("footerContact")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                <span className="text-sm text-neutral-400">{t("footerAddress")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-neutral-500" />
                <a href="tel:+622150300825" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  (+62) 21 50300825
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-neutral-500" />
                <a href="mailto:info@mrplawoffice.com" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  info@mrplawoffice.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                <span className="text-sm text-neutral-400">{t("footerHours")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} MRP Law Office. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">M&R Partners Law Office</p>
        </div>
      </div>
    </footer>
  );
}

