import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { downloadUrl, GITHUB_URL, release, sizeMB } from "@/lib/release";
import { fill } from "@/lib/format";
import { CodeBlock } from "@/components/CodeBlock";
import { Screenshot } from "@/components/Screenshot";
import { ModulesGrid } from "@/components/ModulesGrid";
import { StructureSection } from "@/components/StructureSection";
import { ScreenshotTabs, type Shot } from "@/components/ScreenshotTabs";

// Real screenshots, taken from UzOS running in QEMU.
import uzfetchShot from "@/public/screenshots/uzfetch.png";
import seclabShot from "@/public/screenshots/seclab.png";
import htopShot from "@/public/screenshots/htop.png";
import btopShot from "@/public/screenshots/btop.png";
import auditShot from "@/public/screenshots/audit.png";
import memoryShot from "@/public/screenshots/memory.png";
import filesShot from "@/public/screenshots/files.png";
import helpShot from "@/public/screenshots/help.png";
import desktopShot from "@/public/screenshots/desktop.png";
import bootShot from "@/public/screenshots/boot.png";

const shotFiles = {
  uzfetch: uzfetchShot,
  seclab: seclabShot,
  htop: htopShot,
  btop: btopShot,
  audit: auditShot,
  memory: memoryShot,
  files: filesShot,
  help: helpShot,
  desktop: desktopShot,
  boot: bootShot,
};

// A section heading: title and one line under it.
function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{title}</h2>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const values = { version: release.version, size: sizeMB };

  const stats = [
    { value: "83", label: dict.stats.commands },
    { value: "70", label: dict.stats.attacks },
    { value: "12", label: dict.stats.managements },
    { value: "32-bit", label: dict.stats.arch },
  ];

  const shots: Shot[] = (Object.keys(shotFiles) as (keyof typeof shotFiles)[]).map((id) => ({
    id,
    src: shotFiles[id],
    ...dict.screenshots.items[id],
  }));

  const steps = [dict.quickstart.step1, dict.quickstart.step2, dict.quickstart.step3];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden">
        {/* soft blue and green light behind the hero */}
        <div aria-hidden="true" className="absolute -left-40 -top-48 -z-10 size-[40rem] rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-800/30" />
        <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 size-[32rem] rounded-full bg-leaf-400/15 blur-3xl dark:bg-leaf-700/15" />

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div>
            <Link
              href={`/${lang}/download`}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 hover:border-brand-300 dark:border-brand-800 dark:bg-slate-900/60 dark:text-brand-200"
            >
              <span className="size-1.5 rounded-full bg-leaf-500" />
              {fill(dict.hero.badge, values)}
              <span aria-hidden="true">→</span>
            </Link>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              {dict.hero.title}{" "}
              <span className="bg-gradient-to-r from-brand-500 to-leaf-500 bg-clip-text text-transparent">{dict.hero.titleAccent}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{dict.hero.subtitle}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                {fill(dict.hero.download, values)}
              </a>
              <Link
                href={`/${lang}/docs`}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {dict.hero.docs}
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">{fill(dict.hero.note, values)}</p>
          </div>

          <Screenshot src={uzfetchShot} title="root@uzos: ~ — uzfetch" priority />
        </div>
      </section>

      {/* ---------- Numbers ---------- */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{s.value}</dd>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- The 12 managements ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Heading title={dict.modules.title} subtitle={dict.modules.subtitle} />
        <div className="mt-12">
          <ModulesGrid locale={lang} dict={dict} />
        </div>
      </section>

      {/* ---------- Clean structure ---------- */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Heading title={dict.structure.title} subtitle={dict.structure.subtitle} />
          <div className="mt-12">
            <StructureSection dict={dict} />
          </div>
        </div>
      </section>

      {/* ---------- Quick start ---------- */}
      <section className="bg-slate-900 text-white dark:bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{dict.quickstart.title}</h2>
          <p className="mt-4 text-lg text-slate-400">{dict.quickstart.subtitle}</p>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-leaf-500 text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{fill(step.text, values)}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 max-w-2xl">
            <CodeBlock>
              <code>qemu-system-i386 -cdrom UzOS.iso -m 128</code>
            </CodeBlock>
            <Link href={`/${lang}/docs/install/qemu`} className="text-sm font-medium text-brand-300 hover:text-brand-200">
              {dict.quickstart.more} →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Real screenshots ---------- */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <Heading title={dict.screenshots.title} subtitle={dict.screenshots.subtitle} />
        <div className="mt-10">
          <ScreenshotTabs shots={shots} />
        </div>
      </section>

      {/* ---------- Learning ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-white sm:px-12">
          <div aria-hidden="true" className="flag-stripe absolute inset-x-0 bottom-0 h-1.5" />
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">{dict.learn.title}</h2>
          <p className="mt-4 max-w-2xl text-brand-50/90">{dict.learn.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${lang}/docs/modules`} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
              {dict.learn.guide}
            </Link>
            <a href={GITHUB_URL} className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              {dict.learn.source}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
