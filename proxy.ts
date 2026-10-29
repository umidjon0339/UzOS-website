import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales, LOCALE_COOKIE, type Locale } from "@/i18n/config";

// Every page lives under /en, /uz or /ru. A visitor who opens a path
// without a language (e.g. "/download") is sent to:
//   1. the language of the last page they visited (cookie)
//   2. otherwise English
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return saved && hasLocale(saved) ? saved : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const current = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  // A page in some language: remember that language for next time.
  if (current) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
      response.cookies.set(LOCALE_COOKIE, current, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  request.nextUrl.pathname = `/${pickLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals and files with an extension (images, icons...).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
