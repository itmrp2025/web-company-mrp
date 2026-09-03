import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

function getLocale(pathname: string): string {
  const segment = pathname.split("/")[1];
  return routing.locales.includes(segment as (typeof routing.locales)[number])
    ? segment
    : routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = stripLocale(pathname);
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isLoginRoute =
    pathWithoutLocale === "/admin/login" ||
    pathWithoutLocale.startsWith("/admin/login/");
  const hasSession = request.cookies.has("access_token");
  const locale = getLocale(pathname);

  // Protect admin routes — redirect to login if no session cookie
  if (isAdminRoute && !isLoginRoute && !hasSession) {
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set("returnURL", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in — bounce away from login page
  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  // Let next-intl handle locale routing for everything else
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
