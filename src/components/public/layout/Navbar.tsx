"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { Menu, X, Phone } from "lucide-react";

type NavLink = {
  key: "home" | "about" | "services" | "team" | "gallery" | "articles" | "tanyaHakim" | "career" | "contact";
  href: string;
  external?: boolean;
};

const navLinks: NavLink[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "team", href: "/our-team" },
  { key: "gallery", href: "/gallery" },
  { key: "articles", href: "/articles" },
  { key: "tanyaHakim", href: "https://tanyahakim.com", external: true },
  { key: "career", href: "/career" },
  { key: "contact", href: "/contact" },
];

export function Navbar() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top bar */}
      <div className="hidden lg:block border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-neutral-500 tracking-wide">
            {t("topBarText")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="tel:+622150300825"
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3" />
              (+62) 21 50300825
            </a>
            <span className="h-3 w-px bg-neutral-200" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo-mrp.png"
            alt="MRP Law Office"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="hidden sm:block leading-none">
            <p className="font-sans text-base font-semibold text-neutral-900 leading-tight">MRP Law Office</p>
            <p className="text-[10px] tracking-[0.12em] uppercase text-neutral-400 mt-0.5">Advocates & Consultants</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-[13px] text-neutral-500 transition-colors hover:text-primary"
              >
                {t(link.key)}
              </a>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 text-[13px] transition-colors relative",
                  isActive(link.href)
                    ? "text-primary font-medium after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary"
                    : "text-neutral-500 hover:text-primary"
                )}
              >
                {t(link.key)}
              </Link>
            )
          )}
        </nav>

        {/* Right â€” mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            className="flex h-9 w-9 items-center justify-center rounded text-neutral-600 hover:bg-neutral-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-neutral-100 bg-white">
          <nav className="flex flex-col py-2">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {t(link.key)}
                </a>
              ) : (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "px-6 py-3 text-sm",
                    isActive(link.href)
                      ? "font-medium text-primary bg-primary/5 border-l-2 border-primary"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {t(link.key)}
                </Link>
              )
            )}
          </nav>
          <div className="border-t border-neutral-100 px-6 py-3">
            <a href="tel:+622150300825" className="flex items-center gap-2 text-sm text-neutral-500">
              <Phone className="h-4 w-4" /> (+62) 21 50300825
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

