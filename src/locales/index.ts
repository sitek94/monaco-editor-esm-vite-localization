import es from "./es.json"
import de from "./de.json"
import pl from "./pl.json"

export const translations = {
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

export type Locale = keyof typeof translations
