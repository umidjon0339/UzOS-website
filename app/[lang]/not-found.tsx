import Link from "next/link";
import { lang } from "next/root-params";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-mono text-sm text-brand-600 dark:text-brand-300">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{dict.notFound.title}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{dict.notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {dict.notFound.home}
      </Link>
    </section>
  );
}
