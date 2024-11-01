import es from "./es.json"
import de from "./de.json"
import pl from "./pl.json"

export const translationsMap = {
  es,
  en: {},
  de,
  pl,
} satisfies {
  [locale: string]: {
    [path: string]: {
      [key: string]: string
    }
  }
}

export type Locale = keyof typeof translationsMap
export type Translations = (typeof translationsMap)[Locale]
