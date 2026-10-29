"use client";

import { useParams } from "next/navigation";
import { useRef, useState, type ComponentProps } from "react";

const labels = {
  en: { copy: "Copy", copied: "Copied" },
  uz: { copy: "Nusxalash", copied: "Nusxalandi" },
  ru: { copy: "Копировать", copied: "Скопировано" },
};

// A dark terminal-style code block with a copy button.
// Used for every ``` block in the docs (see mdx-components.tsx).
export function CodeBlock(props: ComponentProps<"pre">) {
  const { lang } = useParams<{ lang: keyof typeof labels }>();
  const text = labels[lang] ?? labels.en;
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(ref.current?.innerText.trim() ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative my-5">
      <pre
        ref={ref}
        {...props}
        className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3.5 pr-24 font-mono text-[13.5px] leading-relaxed text-slate-100 ring-1 ring-slate-800 dark:bg-slate-900/80"
      />
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 opacity-80 transition hover:bg-slate-700 hover:text-white group-hover:opacity-100"
      >
        {copied ? `✓ ${text.copied}` : text.copy}
      </button>
    </div>
  );
}
