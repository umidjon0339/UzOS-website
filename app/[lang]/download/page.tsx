import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { downloadUrl, release, releasesUrl, sizeMB } from "@/lib/release";
import { docHref, findDoc } from "@/lib/docs";
import { fill } from "@/lib/format";
import { CodeBlock } from "@/components/CodeBlock";

export async function generateMetadata({ params }: PageProps<"/[lang]/download">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDictionary(lang)).download.title };
}

export default async function DownloadPage({ params }: PageProps<"/[lang]/download">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.download;

  const facts = [
    { label: d.version, value: release.version },
    { label: d.released, value: release.date },
    { label: d.size, value: `${sizeMB} MB` },
    { label: d.arch, value: release.arch },
  ];

  // The install guides, in the order a beginner should try them.
  const guides = ["install/qemu", "install/virtualbox", "install/usb", "build-from-source"]
    .map((slug) => findDoc(slug)!)
    .map((doc) => ({ href: docHref(lang, doc.slug), title: doc.title[lang] }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{d.title}</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{d.subtitle}</p>

      {/* ---------- The download card ---------- */}
      <div className="relative mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flag-stripe h-1.5" />
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-300">UzOS {release.version}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{release.fileName}</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-slate-500">{f.label}</dt>
                  <dd className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a
            href={downloadUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-4 font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            {fill(d.button, { file: release.fileName })}
          </a>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-8 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{d.checksum}</p>
          <p className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-400">{release.sha256}</p>
        </div>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {/* ---------- Requirements + verify ---------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{d.requirementsTitle}</h2>
          <ul className="mt-4 space-y-2.5">
            {d.requirements.map((r) => (
              <li key={r} className="flex gap-3 text-slate-700 dark:text-slate-300">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-500" />
                {r}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">{d.verifyTitle}</h2>
          <CodeBlock>
            <code>sha256sum {release.fileName}</code>
          </CodeBlock>
          <p className="text-sm text-slate-600 dark:text-slate-400">{d.verifyText}</p>
        </section>

        {/* ---------- Next steps + release notes ---------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{d.nextTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-800 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
              >
                {g.title}
                <span className="ml-1 inline-block transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <h2 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">
            {fill(d.notesTitle, { version: release.version })}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {d.notes.map((n) => (
              <li key={n} className="flex gap-3 text-slate-700 dark:text-slate-300">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <a href={releasesUrl} className="text-brand-600 hover:underline dark:text-brand-300">
              {d.older}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
