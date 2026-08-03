/**
 * International UX provider — Language + Currency.
 *
 * - Persists choice in localStorage (`sv.lang`, `sv.currency`).
 * - Applies <html lang> + <html dir> for RTL/LTR-safe spacing.
 * - Exposes formatters (`formatCurrency`, `formatNumber`, `formatDate`,
 *   `t`) that every premium surface (TopBar dropdowns, tables, reports)
 *   should use instead of hardcoding strings or symbols.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";

export type LanguageCode =
  | "en" | "hi" | "es" | "fr" | "de" | "pt" | "it" | "ja" | "zh" | "ar" | "he" | "ur";

export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "INR" | "JPY" | "AUD" | "CAD" | "AED" | "SGD" | "BRL";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
  locale: string;
  dir: "ltr" | "rtl";
}
export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English",    native: "English",    locale: "en-US", dir: "ltr" },
  { code: "hi", label: "Hindi",      native: "हिन्दी",      locale: "hi-IN", dir: "ltr" },
  { code: "es", label: "Spanish",    native: "Español",    locale: "es-ES", dir: "ltr" },
  { code: "fr", label: "French",     native: "Français",   locale: "fr-FR", dir: "ltr" },
  { code: "de", label: "German",     native: "Deutsch",    locale: "de-DE", dir: "ltr" },
  { code: "pt", label: "Portuguese", native: "Português",  locale: "pt-BR", dir: "ltr" },
  { code: "it", label: "Italian",    native: "Italiano",   locale: "it-IT", dir: "ltr" },
  { code: "ja", label: "Japanese",   native: "日本語",       locale: "ja-JP", dir: "ltr" },
  { code: "zh", label: "Chinese",    native: "中文",         locale: "zh-CN", dir: "ltr" },
  { code: "ar", label: "Arabic",     native: "العربية",     locale: "ar-AE", dir: "rtl" },
  { code: "he", label: "Hebrew",     native: "עברית",       locale: "he-IL", dir: "rtl" },
  { code: "ur", label: "Urdu",       native: "اردو",        locale: "ur-PK", dir: "rtl" },
];

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "US Dollar",        symbol: "$"   },
  { code: "EUR", label: "Euro",             symbol: "€"   },
  { code: "GBP", label: "British Pound",    symbol: "£"   },
  { code: "INR", label: "Indian Rupee",     symbol: "₹"   },
  { code: "JPY", label: "Japanese Yen",     symbol: "¥"   },
  { code: "AUD", label: "Australian Dollar",symbol: "A$"  },
  { code: "CAD", label: "Canadian Dollar",  symbol: "C$"  },
  { code: "AED", label: "UAE Dirham",       symbol: "د.إ" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$"  },
  { code: "BRL", label: "Brazilian Real",   symbol: "R$"  },
];

interface I18nContextValue {
  language: LanguageOption;
  currency: CurrencyOption;
  setLanguage: (code: LanguageCode) => void;
  setCurrency: (code: CurrencyCode) => void;
  dir: "ltr" | "rtl";
  formatCurrency: (n: number | null | undefined, opts?: Intl.NumberFormatOptions) => string;
  formatNumber: (n: number | null | undefined, opts?: Intl.NumberFormatOptions) => string;
  formatDate: (d: Date | string | number | null | undefined, opts?: Intl.DateTimeFormatOptions) => string;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STRINGS: Partial<Record<LanguageCode, Record<string, string>>> = {
  en: {
    search: "Search…", language: "Language", currency: "Currency",
    filters: "Filters", rows: "Rows", export: "Export", new: "New",
  },
  hi: {
    search: "खोजें…", language: "भाषा", currency: "मुद्रा",
    filters: "फ़िल्टर", rows: "पंक्तियाँ", export: "निर्यात", new: "नया",
  },
  ar: {
    search: "بحث…", language: "اللغة", currency: "العملة",
    filters: "عوامل التصفية", rows: "الصفوف", export: "تصدير", new: "جديد",
  },
  he: {
    search: "חיפוש…", language: "שפה", currency: "מטבע",
    filters: "מסננים", rows: "שורות", export: "ייצוא", new: "חדש",
  },
};

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return (window.localStorage.getItem(key) as T) || fallback; } catch { return fallback; }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState<LanguageCode>(() => readStored<LanguageCode>("sv.lang", "en"));
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => readStored<CurrencyCode>("sv.currency", "USD"));

  const language = useMemo(
    () => LANGUAGES.find((l) => l.code === langCode) ?? LANGUAGES[0],
    [langCode],
  );
  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0],
    [currencyCode],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLangCode(code);
    try { window.localStorage.setItem("sv.lang", code); } catch { /* ignore */ }
  }, []);
  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyCode(code);
    try { window.localStorage.setItem("sv.currency", code); } catch { /* ignore */ }
  }, []);

  const formatCurrency = useCallback(
    (n: number | null | undefined, opts?: Intl.NumberFormatOptions) => {
      if (n == null || Number.isNaN(n)) return "—";
      return new Intl.NumberFormat(language.locale, {
        style: "currency", currency: currency.code,
        maximumFractionDigits: 2, ...opts,
      }).format(n);
    },
    [language.locale, currency.code],
  );
  const formatNumber = useCallback(
    (n: number | null | undefined, opts?: Intl.NumberFormatOptions) => {
      if (n == null || Number.isNaN(n)) return "—";
      return new Intl.NumberFormat(language.locale, opts).format(n);
    },
    [language.locale],
  );
  const formatDate = useCallback(
    (d: Date | string | number | null | undefined, opts?: Intl.DateTimeFormatOptions) => {
      if (d == null) return "—";
      const date = d instanceof Date ? d : new Date(d);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(language.locale, opts ?? { dateStyle: "medium" }).format(date);
    },
    [language.locale],
  );
  const t = useCallback(
    (key: string, fallback?: string) =>
      STRINGS[language.code]?.[key] ?? STRINGS.en?.[key] ?? fallback ?? key,
    [language.code],
  );

  const value = useMemo<I18nContextValue>(() => ({
    language, currency, setLanguage, setCurrency, dir: language.dir,
    formatCurrency, formatNumber, formatDate, t,
  }), [language, currency, setLanguage, setCurrency, formatCurrency, formatNumber, formatDate, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider />");
  return ctx;
}
