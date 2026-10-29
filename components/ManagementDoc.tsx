import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OsModule } from "@/lib/modules";
import type { AttackPair, Command, CorePart, ModuleData, Syscall } from "@/lib/os-data";
import { GITHUB_URL } from "@/lib/release";
import { CodeBlock } from "./CodeBlock";

// One docs page for one management: its core parts, commands, system
// calls and attack/defence pairs, all read from the UzOS source.

type T = Dictionary["management"];

const sourceUrl = (path: string) => `${GITHUB_URL}/tree/main/${path}`;

// `code` in a comment line -> <code>code</code>
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function SourceLink({ path, label }: { path: string; label: string }) {
  return (
    <a
      href={sourceUrl(path)}
      target="_blank"
      rel="noreferrer"
      title={path}
      className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400 hover:text-brand-600 dark:hover:text-brand-300"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 4L2 8l4 4M10 4l4 4-4 4" />
      </svg>
      {label}
    </a>
  );
}

// "How it works": the rest of the header comment, folded away.
function More({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group mt-2">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 [&::-webkit-details-marker]:hidden">
        <span className="transition group-open:rotate-90" aria-hidden="true">›</span>
        {label}
      </summary>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}

function Pre({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-50 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
      {text}
    </pre>
  );
}

function Uses({ t, uses }: { t: T; uses: string }) {
  if (!uses) return null;
  return (
    <p className="text-xs leading-relaxed text-slate-500">
      <span className="font-medium text-slate-600 dark:text-slate-400">{t.uses}:</span> {uses}
    </p>
  );
}

// A titled block with a one-line explanation and a count.
function Section({ id, title, intro, count, children }: { id: string; title: string; intro: string; count: number; children: ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{count}</span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{intro}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const listBox = "divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900";

function CoreList({ t, items }: { t: T; items: CorePart[] }) {
  return (
    <ul className={listBox}>
      {items.map((c) => (
        <li key={c.path} className="flex items-start justify-between gap-4 px-5 py-3.5">
          <div className="min-w-0">
            <code className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{c.name}/</code>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400"><Inline text={c.summary} /></p>
          </div>
          <SourceLink path={c.path} label={t.source} />
        </li>
      ))}
    </ul>
  );
}

function CommandList({ t, items }: { t: T; items: Command[] }) {
  return (
    <ul className={listBox}>
      {items.map((c) => (
        <li key={c.path} className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <code className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{c.usage}</code>
            <SourceLink path={c.path} label={t.source} />
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400"><Inline text={c.summary} /></p>
          {(c.details || c.uses) && (
            <More label={t.howItWorks}>
              {c.details && <Pre text={c.details} />}
              <Uses t={t} uses={c.uses} />
            </More>
          )}
        </li>
      ))}
    </ul>
  );
}

function SyscallList({ t, items }: { t: T; items: Syscall[] }) {
  return (
    <ul className={listBox}>
      {items.map((s) => (
        <li key={s.path} className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {s.number !== null && (
                <span className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  #{s.number}
                </span>
              )}
              <code className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{s.name}()</code>
              {s.stub && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{t.stub}</span>
              )}
            </div>
            <SourceLink path={s.path} label={t.source} />
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400"><Inline text={s.summary} /></p>
          {(s.details || s.uses) && (
            <More label={t.howItWorks}>
              {s.details && <Pre text={s.details} />}
              <Uses t={t} uses={s.uses} />
            </More>
          )}
        </li>
      ))}
    </ul>
  );
}

const severityStyle: Record<string, string> = {
  critical: "bg-flag-red/10 text-flag-red",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  info: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
};

function Pair({ t, p }: { t: T; p: AttackPair }) {
  const d = p.defence;
  const breaks = t.invariants[p.breaks as keyof T["invariants"]] ?? p.breaks;
  return (
    <article id={p.id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
        <span className={`rounded-full px-2 py-0.5 ${severityStyle[p.severity] ?? severityStyle.low}`}>
          {t.severity[p.severity as keyof T["severity"]] ?? p.severity}
        </span>
        {p.kind !== "live" && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t.kinds[p.kind]}</span>
        )}
        <span className="text-slate-500 dark:text-slate-400">
          {t.breaks}: {breaks}
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-flag-red">
            <span className="size-1.5 rounded-full bg-flag-red" />
            {t.attack}
          </p>
          <code className="mt-1 block font-mono text-sm font-semibold text-slate-900 dark:text-white">{p.id}</code>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400"><Inline text={p.what} /></p>
        </div>
        <div className="md:border-l md:border-slate-200 md:pl-4 dark:md:border-slate-800">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-leaf-600 dark:text-leaf-400">
            <span className="size-1.5 rounded-full bg-leaf-500" />
            {t.defence}
          </p>
          <code className="mt-1 block font-mono text-sm font-semibold text-slate-900 dark:text-white">{d.id}</code>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400"><Inline text={d.fix} /></p>
        </div>
      </div>

      <More label={t.more}>
        <div className="space-y-3 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          {p.story && <p><Inline text={p.story} /></p>}
          {p.modes.length > 0 && (
            <ul className="space-y-1">
              {p.modes.map((m) => (
                <li key={m.mode} className="flex gap-2">
                  <code className="shrink-0 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{m.mode}</code>
                  <span className="text-sm"><Inline text={m.text} /></span>
                </li>
              ))}
            </ul>
          )}
          {d.story && <p><Inline text={d.story} /></p>}
          {d.called && (
            <p>
              <span className="font-medium text-slate-800 dark:text-slate-200">{t.called}:</span> <Inline text={d.called} />
            </p>
          )}
          {d.rules && (
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{t.rules}:</p>
              <Pre text={d.rules} />
            </div>
          )}
          {d.why && (
            <p>
              <span className="font-medium text-slate-800 dark:text-slate-200">{t.why}:</span> <Inline text={d.why} />
            </p>
          )}
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{t.tryIt}:</p>
            <CodeBlock>
              <code>{p.tryIt || `seclab info ${p.id}\nseclab attack ${p.id}`}</code>
            </CodeBlock>
          </div>
          <div className="flex flex-wrap gap-4">
            <SourceLink path={p.path} label={`${t.attack}: ${p.id}`} />
            {d.path && <SourceLink path={d.path} label={`${t.defence}: ${d.id}`} />}
          </div>
        </div>
      </More>
    </article>
  );
}

export function ManagementDoc({ locale, dict, mod, data }: { locale: Locale; dict: Dictionary; mod: OsModule; data: ModuleData }) {
  const t = dict.management;
  const planned = mod.status === "planned";

  const stats = [
    { id: "core", value: data.core.length, label: t.stats.core },
    { id: "commands", value: data.commands.length, label: t.stats.commands },
    { id: "syscalls", value: data.syscalls.length, label: t.stats.syscalls },
    { id: "security", value: data.security.length, label: t.stats.security },
  ];

  return (
    <article className="max-w-4xl">
      {/* ---------- header ---------- */}
      <p className="text-sm font-medium text-brand-600 dark:text-brand-300">{t.group}</p>
      <div className="mt-3 flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-leaf-400/10 text-brand-600 ring-1 ring-brand-100 dark:from-brand-900/60 dark:to-leaf-700/20 dark:text-brand-300 dark:ring-brand-800/60">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={mod.icon} />
          </svg>
        </span>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{mod.name[locale]}</h1>
          <p className="mt-1 font-mono text-xs text-slate-400">modules/{mod.folder}/</p>
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{mod.text[locale]}</p>

      {planned ? (
        <p className="mt-8 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-100">
          {t.notBuilt}
        </p>
      ) : (
        <>
          {/* ---------- numbers, each a link to its section ---------- */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </a>
            ))}
          </div>

          {locale !== "en" && <p className="mt-6 text-xs text-slate-500">{t.sourceNote}</p>}

          <Section id="core" title={t.core.title} intro={t.core.intro} count={data.core.length}>
            {data.core.length ? <CoreList t={t} items={data.core} /> : <p className="text-sm text-slate-500">{t.none}</p>}
          </Section>

          <Section id="commands" title={t.commands.title} intro={t.commands.intro} count={data.commands.length}>
            {data.commands.length ? <CommandList t={t} items={data.commands} /> : <p className="text-sm text-slate-500">{t.none}</p>}
          </Section>

          <Section id="syscalls" title={t.syscalls.title} intro={t.syscalls.intro} count={data.syscalls.length}>
            {data.syscalls.length ? <SyscallList t={t} items={data.syscalls} /> : <p className="text-sm text-slate-500">{t.none}</p>}
          </Section>

          <Section id="security" title={t.security.title} intro={t.security.intro} count={data.security.length}>
            {data.security.length ? (
              <div className="space-y-4">
                {data.security.map((p) => (
                  <Pair key={p.path} t={t} p={p} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">{t.none}</p>
            )}
          </Section>
        </>
      )}
    </article>
  );
}
