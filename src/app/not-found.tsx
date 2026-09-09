import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { outfit } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { NotFoundContent } from "@/components/public/NotFoundContent";

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <NotFoundContent locale={locale} />
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
