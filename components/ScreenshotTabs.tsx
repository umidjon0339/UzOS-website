"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

export type Shot = {
  id: string;
  label: string;
  caption: string;
  src: StaticImageData;
};

// Real UzOS screenshots: a row of tabs above one large picture.
export function ScreenshotTabs({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const shot = shots[active];

  return (
    <div>
      <div role="tablist" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {shots.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={
              i === active
                ? "shrink-0 rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                : "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <figure role="tabpanel" className="mt-4">
        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10 dark:ring-white/10">
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-slate-800 px-3 py-2">
            <span className="size-2.5 rounded-full bg-flag-red/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-leaf-500/80" />
            <span className="ml-2 text-xs text-slate-400">QEMU — UzOS</span>
          </div>
          <Image
            key={shot.id}
            src={shot.src}
            alt={shot.caption}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="block h-auto w-full [image-rendering:pixelated]"
          />
        </div>
        <figcaption className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{shot.caption}</figcaption>
      </figure>
    </div>
  );
}
