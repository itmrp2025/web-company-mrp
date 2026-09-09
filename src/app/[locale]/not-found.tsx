"use client";

import { useLocale } from "next-intl";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { NotFoundContent } from "@/components/public/NotFoundContent";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <NotFoundContent locale={locale} />
      <Footer />
    </div>
  );
}
