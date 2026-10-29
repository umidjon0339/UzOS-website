import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { docHref, neighbours } from "@/lib/docs";

// "← Previous / Next →" at the bottom of every docs page.
export function DocPager({ locale, slug, dict }: { locale: Locale; slug: string; dict: Dictionary }) {
  const { prev, next } = neighbours(slug);
  return (
    <nav className="mt-16 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800">
      {prev ? (
        <Link href={docHref(locale, prev.slug)} className="group rounded-xl border border-slate-200 p-4 hover:border-brand-400 dark:border-slate-800 dark:hover:border-brand-700">
          <span className="text-xs text-slate-500">← {dict.docs.prev}</span>
          <span className="mt-1 block font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">{prev.title[locale]}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={docHref(locale, next.slug)} className="group rounded-xl border border-slate-200 p-4 text-right hover:border-brand-400 dark:border-slate-800 dark:hover:border-brand-700">
          <span className="text-xs text-slate-500">{dict.docs.next} →</span>
          <span className="mt-1 block font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">{next.title[locale]}</span>
        </Link>
      )}
    </nav>
  );
}
