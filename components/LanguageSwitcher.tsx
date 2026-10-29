"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

// EN / UZ / RU buttons. Each one links to the same page in that
// language: only the first part of the path changes. proxy.ts then
// remembers the choice in a cookie.
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();

  function hrefFor(locale: Locale) {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${locale}${rest ? `/${rest}` : ""}`;
  }

  return (
    <nav aria-label={label} className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium dark:bg-slate-800">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          hrefLang={locale}
          title={localeNames[locale]}
          aria-current={locale === current ? "true" : undefined}
          className={
            locale === current
              ? "rounded-md bg-white px-2 py-1 text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
              : "rounded-md px-2 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
