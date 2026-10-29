// The languages of the site. The first one is the default.
export const locales = ["en", "uz", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// How each language names itself in the language switcher.
export const localeNames: Record<Locale, string> = {
  en: "English",
  uz: "Oʻzbekcha",
  ru: "Русский",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Cookie that remembers the language a visitor picked.
export const LOCALE_COOKIE = "NEXT_LOCALE";
