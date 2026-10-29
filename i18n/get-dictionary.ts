import "server-only";
import type { Locale } from "./config";
import type en from "./dictionaries/en.json";

// UI text for every language. Only the requested file is loaded,
// and it stays on the server: no translation text is sent as JS.
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  uz: () => import("./dictionaries/uz.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

// en.json is the reference: uz.json and ru.json must have the same keys.
export type Dictionary = typeof en;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
