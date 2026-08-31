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

export function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const pathWithoutLocale = stripLocale(request.nextUrl.pathname);
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isLoginRoute = pathWithoutLocale.startsWith("/admin/login");

  const hasSession = request.cookies.has("access_token");

  if (isAdminRoute && !isLoginRoute && !hasSession) {
    const locale = request.nextUrl.pathname.split("/")[1];
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set("returnURL", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && hasSession) {
    const locale = request.nextUrl.pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return response;
}

export const middleware = proxy;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
