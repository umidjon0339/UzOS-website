import type { Locale } from "@/i18n/config";
import { osModules } from "@/lib/modules";

// The whole docs tree in one place. It drives the sidebar, the routes
// (/[lang]/docs/<slug>) and the "previous / next" links.
//
// To add a page:
//   1. write content/docs/en/<file>.mdx (and uz/, ru/ when translated;
//      a missing translation falls back to English)
//   2. add an entry below
//
// The "Managements" pages have no MDX file: app/[lang]/docs/managements
// builds them from lib/os-data.json (scripts/extract-uzos.mjs).

type Text = Record<Locale, string>;

export type DocPage = {
  slug: string; // URL after /docs/ ("" is the docs home)
  file?: string; // file name in content/docs/<lang>/, without .mdx
  title: Text;
};

export type DocGroup = {
  title: Text;
  pages: DocPage[];
};

export const docGroups: DocGroup[] = [
  {
    title: { en: "Start here", uz: "Boshlash", ru: "Начало" },
    pages: [
      {
        slug: "",
        file: "index",
        title: { en: "Introduction", uz: "Kirish", ru: "Введение" },
      },
      {
        slug: "getting-started",
        file: "getting-started",
        title: { en: "First boot", uz: "Birinchi ishga tushirish", ru: "Первый запуск" },
      },
    ],
  },
  {
    title: { en: "Installation", uz: "Oʻrnatish", ru: "Установка" },
    pages: [
      {
        slug: "install/qemu",
        file: "install-qemu",
        title: { en: "Run in QEMU", uz: "QEMU’da ishga tushirish", ru: "Запуск в QEMU" },
      },
      {
        slug: "install/virtualbox",
        file: "install-virtualbox",
        title: { en: "Run in VirtualBox", uz: "VirtualBox’da ishga tushirish", ru: "Запуск в VirtualBox" },
      },
      {
        slug: "install/usb",
        file: "install-usb",
        title: { en: "Boot from USB", uz: "USB’dan yuklash", ru: "Загрузка с USB" },
      },
      {
        slug: "build-from-source",
        file: "build-from-source",
        title: { en: "Build from source", uz: "Manba koddan yigʻish", ru: "Сборка из исходников" },
      },
    ],
  },
  {
    title: { en: "Using UzOS", uz: "UzOS’dan foydalanish", ru: "Работа с UzOS" },
    pages: [
      {
        slug: "commands",
        file: "commands",
        title: { en: "Shell commands", uz: "Buyruqlar", ru: "Команды оболочки" },
      },
      {
        slug: "modules",
        file: "modules",
        title: { en: "How UzOS is built", uz: "UzOS qanday tuzilgan", ru: "Как устроена UzOS" },
      },
      {
        slug: "security-lab",
        file: "security-lab",
        title: { en: "Security lab", uz: "Xavfsizlik laboratoriyasi", ru: "Лаборатория безопасности" },
      },
    ],
  },
];

// One page per management, in the order of lib/modules.ts.
docGroups.push({
  title: { en: "Managements", uz: "Boshqaruvlar", ru: "Подсистемы" },
  pages: osModules.map((m) => ({ slug: `managements/${m.id}`, title: m.name })),
});

export const allDocs: DocPage[] = docGroups.flatMap((g) => g.pages);

export function findDoc(slug: string): DocPage | undefined {
  return allDocs.find((p) => p.slug === slug);
}

// The pages before and after this one, in sidebar order.
export function neighbours(slug: string) {
  const i = allDocs.findIndex((p) => p.slug === slug);
  return { prev: allDocs[i - 1], next: allDocs[i + 1] };
}

export function docHref(locale: Locale, slug: string) {
  return slug ? `/${locale}/docs/${slug}` : `/${locale}/docs`;
}
