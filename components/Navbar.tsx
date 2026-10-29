import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { GITHUB_URL } from "@/lib/release";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

// The bar at the top of every page. On small screens the links fold
// into a <details> menu, which needs no JavaScript.
export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}/download`, label: dict.nav.download },
    { href: `/${locale}/docs`, label: dict.nav.docs },
    { href: GITHUB_URL, label: dict.nav.github },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={`/${locale}`} aria-label={dict.nav.home}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher current={locale} label={dict.nav.language} />
          <ThemeToggle label={dict.nav.theme} />

          <details className="relative md:hidden">
            <summary
              aria-label={dict.nav.menu}
              className="grid size-9 cursor-pointer list-none place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 [&::-webkit-details-marker]:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
      <div className="flag-stripe h-[3px] opacity-90" />
    </header>
  );
}
