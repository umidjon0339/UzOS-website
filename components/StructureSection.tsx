import type { Dictionary } from "@/i18n/get-dictionary";

// "One folder, one idea": the real layout of cpu_management, what each
// of the four folders is for, and a real file from the UzOS source.

type Kind = "core" | "commands" | "syscalls" | "security";

// Colour of each of the four folders, used in the tree and the cards.
const tone: Record<Kind, string> = {
  core: "bg-slate-400",
  commands: "bg-brand-500",
  syscalls: "bg-leaf-500",
  security: "bg-flag-red",
};

type Row = {
  depth: number;
  name: string;
  dir?: boolean;
  kind?: Kind; // marks the four top folders
  note?: keyof Dictionary["structure"]["tree"];
};

// Real files from modules/cpu_management in the UzOS repository.
const tree: Row[] = [
  { depth: 0, name: "modules/cpu_management/", dir: true },
  { depth: 1, name: "core/", dir: true, kind: "core", note: "core" },
  { depth: 2, name: "tsc/", dir: true },
  { depth: 3, name: "tsc.c" },
  { depth: 3, name: "tsc.h" },
  { depth: 1, name: "commands/", dir: true, kind: "commands" },
  { depth: 2, name: "top/", dir: true, note: "command" },
  { depth: 3, name: "cmd_top.c" },
  { depth: 3, name: "cmd_top.h" },
  { depth: 1, name: "syscalls/", dir: true, kind: "syscalls" },
  { depth: 2, name: "getpid/", dir: true, note: "syscall" },
  { depth: 3, name: "sys_getpid.c" },
  { depth: 3, name: "sys_getpid.h" },
  { depth: 1, name: "security/", dir: true, kind: "security" },
  { depth: 2, name: "fork_bomb/", dir: true },
  { depth: 3, name: "atk_fork_bomb.c", note: "attack" },
  { depth: 3, name: "README.md" },
  { depth: 3, name: "defence/", dir: true },
  { depth: 4, name: "process_quota/", dir: true },
  { depth: 5, name: "def_process_quota.c", note: "defence" },
  { depth: 5, name: "def_process_quota.h" },
];

// modules/cpu_management/syscalls/getpid/sys_getpid.c, unchanged.
const code = `/*
 * sys_getpid.c - getpid(): return the process ID of the caller.
 *
 * A "process" in Linux terms is a thread GROUP: the first thread and
 * every thread it made with clone(CLONE_THREAD). They all answer the
 * same getpid(), the group's id (tgid). A process without threads is a
 * group of one, so its tgid is simply its pid.
 *
 * Uses: scheduler_get_current_process (process_management/core/scheduler).
 */

#include "modules/cpu_management/syscalls/getpid/sys_getpid.h"     // this syscall
#include "modules/process_management/core/scheduler/scheduler.h"    // scheduler_get_current_process

uint32_t sys_getpid(void) {
    process_t *self = scheduler_get_current_process();
    if (!self)
        return 0;
    return self->tgid ? self->tgid : self->pid;
}`;

// Icons for the four principles (24x24, stroke).
const principleIcons = [
  "M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8", // a box: self-contained
  "M5 5h14v10H9l-4 4zM9 9h6M9 12h4", // a speech bubble: explained
  "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", // an eye: nothing hidden
  "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4", // a shield: break and fix
];

function FolderIcon({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d={open ? "M1.5 4.5v8h11l2-6H4l-2.5 6M1.5 4.5V3h4l1.5 1.5h5V6.5" : "M1.5 3.5h4.5l1.5 1.5h7v8h-13z"} strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3" strokeLinejoin="round" />
    </svg>
  );
}

// Colours a few kinds of C lines; enough to make the comment stand out.
function CodeLine({ line }: { line: string }) {
  if (/^\s*(\/\*|\*)/.test(line)) return <span className="text-slate-500">{line}</span>;
  if (line.startsWith("#include")) {
    const [stmt, comment] = line.split("//");
    return (
      <>
        <span className="text-brand-300">{stmt}</span>
        {comment !== undefined && <span className="text-slate-500">{`//${comment}`}</span>}
      </>
    );
  }
  return <span className="text-slate-200">{line}</span>;
}

export function StructureSection({ dict }: { dict: Dictionary }) {
  const s = dict.structure;
  const kinds: Kind[] = ["core", "commands", "syscalls", "security"];
  const noteColour = { attack: "text-flag-red", defence: "text-leaf-600 dark:text-leaf-400" };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* the real tree */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-[13px] dark:border-slate-800 dark:bg-slate-900/60">
          <ul className="min-w-max space-y-1">
            {tree.map((row, i) => (
              <li key={i} className="flex items-center gap-2" style={{ paddingLeft: `${row.depth * 1.15}rem` }}>
                {row.dir ? <FolderIcon open={row.depth < 3} /> : <FileIcon />}
                <span className={row.dir ? "font-medium text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}>
                  {row.name}
                </span>
                {row.kind && <span className={`size-1.5 rounded-full ${tone[row.kind]}`} />}
                {row.note && (
                  <span
                    className={`font-sans text-xs ${
                      row.note === "attack" || row.note === "defence" ? noteColour[row.note] : "text-slate-400"
                    }`}
                  >
                    ← {s.tree[row.note]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* what each folder is for */}
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {kinds.map((k) => (
            <div key={k} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${tone[k]}`} />
                <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{s.folders[k].title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.folders[k].text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* why it is easy to learn */}
      <h3 className="mt-16 text-xl font-semibold text-slate-900 dark:text-white">{s.principlesTitle}</h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {s.principles.map((p, i) => (
          <div key={p.title}>
            <svg viewBox="0 0 24 24" className="size-6 text-brand-600 dark:text-brand-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={principleIcons[i]} />
            </svg>
            <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{p.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.text}</p>
          </div>
        ))}
      </div>

      {/* a real file */}
      <figure className="mt-14 overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
          <FileIcon />
          <span className="font-mono text-xs text-slate-400">modules/cpu_management/syscalls/getpid/sys_getpid.c</span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed">
          {code.split("\n").map((line, i) => (
            <div key={i}>{line ? <CodeLine line={line} /> : " "}</div>
          ))}
        </pre>
        <figcaption className="border-t border-white/5 px-4 py-2.5 text-xs text-slate-400">{s.codeCaption}</figcaption>
      </figure>
    </>
  );
}
