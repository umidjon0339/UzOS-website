import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { osModules } from "@/lib/modules";

// The 12 managements as cards: a large icon, the name, its folder in
// the repo, what it does, and commands to try (when it has any).
export function ModulesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {osModules.map((m) => (
        <article
          key={m.id}
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] transition duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-leaf-400/10 text-brand-600 ring-1 ring-brand-100 transition group-hover:from-brand-100 dark:from-brand-900/60 dark:to-leaf-700/20 dark:text-brand-300 dark:ring-brand-800/60">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={m.icon} />
            </svg>
          </span>

          <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">{m.name[locale]}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400 dark:text-slate-500">modules/{m.folder}/</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.text[locale]}</p>

          {m.commands.length > 0 && (
            <div className="mt-auto pt-5">
              <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="mr-0.5 text-xs text-slate-400">{dict.modules.try}:</span>
                {m.commands.map((c) => (
                  <code
                    key={c}
                    className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </code>
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
