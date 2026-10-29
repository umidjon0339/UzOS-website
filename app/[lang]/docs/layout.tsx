import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { docGroups, docHref } from "@/lib/docs";
import { DocsSidebar, type SidebarGroup } from "@/components/DocsSidebar";

// Sidebar on the left (or a folding menu on phones), the page on the right.
export default async function DocsLayout({ children, params }: LayoutProps<"/[lang]/docs">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const groups: SidebarGroup[] = docGroups.map((g) => ({
    title: g.title[lang],
    links: g.pages.map((p) => ({ href: docHref(lang, p.slug), title: p.title[lang] })),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-10">
          <DocsSidebar groups={groups} />
        </div>
      </aside>

      <details className="group mt-6 rounded-xl border border-slate-200 lg:hidden dark:border-slate-800">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          {dict.docs.menu}
          <span className="transition group-open:rotate-180" aria-hidden="true">▾</span>
        </summary>
        <div className="border-t border-slate-200 px-1 py-4 dark:border-slate-800">
          <DocsSidebar groups={groups} />
        </div>
      </details>

      <div className="min-w-0 py-10 lg:py-12">{children}</div>
    </div>
  );
}
