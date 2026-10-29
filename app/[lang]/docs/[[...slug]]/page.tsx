import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { allDocs, findDoc } from "@/lib/docs";
import { DocPager } from "@/components/DocPager";

// /docs            -> slug undefined -> ""
// /docs/install/qemu -> ["install", "qemu"] -> "install/qemu"
function slugOf(parts: string[] | undefined) {
  return parts?.join("/") ?? "";
}

// The page in the visitor's language, or the English one if it is
// not translated yet.
async function loadDoc(lang: Locale, file: string) {
  try {
    const mod = await import(`@/content/docs/${lang}/${file}.mdx`);
    return { Content: mod.default, fallback: false };
  } catch {
    const mod = await import(`@/content/docs/en/${file}.mdx`);
    return { Content: mod.default, fallback: lang !== "en" };
  }
}

// Every MDX doc page is built at build time; any other URL is a 404.
// (Management pages have their own route: docs/managements/[id].)
export function generateStaticParams() {
  return allDocs.filter((doc) => doc.file).map((doc) => ({ slug: doc.slug ? doc.slug.split("/") : [] }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/docs/[[...slug]]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const doc = findDoc(slugOf(slug));
  if (!hasLocale(lang) || !doc) return {};
  return { title: doc.title[lang] };
}

export default async function DocPage({ params }: PageProps<"/[lang]/docs/[[...slug]]">) {
  const { lang, slug } = await params;
  const doc = findDoc(slugOf(slug));
  if (!hasLocale(lang) || !doc?.file) notFound();

  const dict = await getDictionary(lang);
  const { Content, fallback } = await loadDoc(lang, doc.file);

  return (
    <article className="max-w-3xl">
      {fallback && (
        <p className="mb-8 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          {dict.docs.fallback}
        </p>
      )}

      <div className="docs-prose">
        <Content />
      </div>

      <DocPager locale={lang} slug={doc.slug} dict={dict} />
    </article>
  );
}
