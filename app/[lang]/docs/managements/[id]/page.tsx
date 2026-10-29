import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { osModules } from "@/lib/modules";
import { moduleData } from "@/lib/os-data";
import { ManagementDoc } from "@/components/ManagementDoc";
import { DocPager } from "@/components/DocPager";

// /[lang]/docs/managements/<id>: one page per management (lib/modules.ts),
// filled from lib/os-data.json.

export function generateStaticParams() {
  return osModules.map((m) => ({ id: m.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/docs/managements/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const mod = osModules.find((m) => m.id === id);
  if (!hasLocale(lang) || !mod) return {};
  return { title: mod.name[lang], description: mod.text[lang] };
}

export default async function ManagementPage({ params }: PageProps<"/[lang]/docs/managements/[id]">) {
  const { lang, id } = await params;
  const mod = osModules.find((m) => m.id === id);
  if (!hasLocale(lang) || !mod) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <ManagementDoc locale={lang} dict={dict} mod={mod} data={moduleData(mod.folder)} />
      <div className="max-w-4xl">
        <DocPager locale={lang} slug={`managements/${mod.id}`} dict={dict} />
      </div>
    </>
  );
}
