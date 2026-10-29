"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarGroup = {
  title: string;
  links: { href: string; title: string }[];
};

// The list of doc pages. The page you are on is highlighted.
export function DocsSidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-7 text-sm">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.title}</h3>
          <ul className="space-y-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "block rounded-lg bg-brand-50 px-3 py-1.5 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                        : "block rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
