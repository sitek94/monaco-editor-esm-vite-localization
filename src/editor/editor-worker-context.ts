import {getCurrentTranslations, Translations} from '../i18n'

const translations = getCurrentTranslations()

declare global {
  interface Window {
    __TRANSLATIONS__: Translations
  }
}

window.__TRANSLATIONS__ = translations
