import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { GITHUB_URL, releasesUrl } from "@/lib/release";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const columns = [
    {
      title: dict.footer.product,
      links: [
        { href: `/${locale}/download`, label: dict.nav.download },
        { href: `/${locale}/docs`, label: dict.nav.docs },
        { href: `/${locale}/docs/install/qemu`, label: dict.footer.install },
      ],
    },
    {
      title: dict.footer.resources,
      links: [
        { href: GITHUB_URL, label: dict.footer.source },
        { href: releasesUrl, label: dict.footer.releases },
        { href: `${GITHUB_URL}/issues`, label: dict.footer.issues },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{dict.footer.tagline}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800">
        © 2026 {dict.footer.rights}
      </div>
    </footer>
  );
}
