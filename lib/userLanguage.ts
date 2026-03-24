import type { Language } from "./translations";

const STORAGE_KEY = "language";
const STORAGE_SOURCE_KEY = "language_source";
const COOKIE_KEY = "lang";
const COOKIE_SOURCE_KEY = "lang_source";

type LanguageSource = "auto" | "user";

function normalizeLanguage(value: string | null | undefined): Language | null {
  return value === "de" || value === "en" ? value : null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match?.[1] ?? null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;

  const isEggceptionDomain =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("eggception.club");

  document.cookie = [
    `${name}=${value}`,
    "Path=/",
    "Max-Age=31536000",
    "SameSite=Lax",
    "Secure",
    isEggceptionDomain ? "Domain=.eggception.club" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function writeStoredLanguage(language: Language, source: LanguageSource) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, language);
  localStorage.setItem(STORAGE_SOURCE_KEY, source);
}

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";

  const browserLocale =
    navigator.languages?.find(Boolean) ??
    navigator.language ??
    "en";

  const baseLanguage = browserLocale.toLowerCase().split("-")[0];
  return baseLanguage.startsWith("de") ? "de" : "en";
}

export function getUserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const cookieLanguage = normalizeLanguage(readCookie(COOKIE_KEY));
  const cookieSource = readCookie(COOKIE_SOURCE_KEY);
  if (cookieLanguage && (!cookieSource || cookieSource === "user")) {
    writeStoredLanguage(cookieLanguage, "user");
    return cookieLanguage;
  }

  const storedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
  const storedSource = localStorage.getItem(STORAGE_SOURCE_KEY);
  if (storedLanguage && (!storedSource || storedSource === "user")) {
    return storedLanguage;
  }

  const detectedLanguage = detectBrowserLanguage();
  writeStoredLanguage(detectedLanguage, "auto");
  return detectedLanguage;
}

export function setUserLanguagePreference(language: Language) {
  writeStoredLanguage(language, "user");
  writeCookie(COOKIE_KEY, language);
  writeCookie(COOKIE_SOURCE_KEY, "user");
  syncDocumentLanguage(language);
}

export function syncDocumentLanguage(language: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
}
