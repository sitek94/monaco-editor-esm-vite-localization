import es from './locales/es.json'
import de from './locales/de.json'
import pl from './locales/pl.json'

export type Locale = 'es' | 'en' | 'de' | 'pl'
export type Translations = {
  [translationKey: string]: string
}

const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'de', 'pl']
const LOCALE_STORAGE_KEY = 'locale'

const translationsMap: Record<Locale, Translations> = {
  es,
  en: {},
  de,
  pl,
}

export function getCurrentTranslations() {
  return getTranslations(readCurrentLocale())
}

export function getTranslations(locale: Locale) {
  return translationsMap[locale]
}

export function readCurrentLocale(): Locale {
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)

  if (!storedLocale) {
    saveCurrentLocale(DEFAULT_LOCALE)
    return DEFAULT_LOCALE
  }

  if (isValidLocale(storedLocale)) {
    return storedLocale
  }

  console.warn(`Unsupported locale "${storedLocale}", falling back to "${DEFAULT_LOCALE}"`)

  saveCurrentLocale(DEFAULT_LOCALE)
  return DEFAULT_LOCALE
}

export function saveCurrentLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}
