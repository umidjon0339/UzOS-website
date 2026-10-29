import type { ReactNode } from "react";

const styles = {
  note: "border-brand-300 bg-brand-50 text-brand-900 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-100",
  tip: "border-leaf-400 bg-leaf-400/10 text-leaf-700 dark:border-leaf-600 dark:text-leaf-400",
  warning: "border-flag-red/40 bg-flag-red/5 text-red-900 dark:border-flag-red/50 dark:bg-flag-red/10 dark:text-red-200",
};

const marks = { note: "i", tip: "✓", warning: "!" };

// A highlighted box in the docs: a note, a tip, or a warning.
export function Callout({ type = "note", children }: { type?: keyof typeof styles; children: ReactNode }) {
  return (
    <div className={`not-prose my-6 flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[type]}`}>
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-current/15 text-xs font-bold">
        {marks[type]}
      </span>
      <div className="[&_code]:rounded [&_code]:bg-current/10 [&_code]:px-1 [&_code]:font-mono [&_p]:m-0">{children}</div>
    </div>
  );
}
