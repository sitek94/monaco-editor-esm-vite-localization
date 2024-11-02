import './editor/editor-worker-context.ts'
import './editor/editor-worker.ts'

import {Editor} from './editor/editor'
import {Locale, readCurrentLocale, saveCurrentLocale, SUPPORTED_LOCALES} from './i18n.ts'

const currentLocale = readCurrentLocale()

export function App() {
  const onLocaleChange = (locale: Locale) => {
    saveCurrentLocale(locale)

    /**
     * Unfortunately, `monaco-editor` doesn't support changing the language at runtime.
     * https://github.com/microsoft/monaco-editor/issues/4669
     */
    window.location.reload()
  }

  const labels = {
    es: '🇪🇸 Español',
    en: '🇬🇧 English',
    de: '🇩🇪 Deutsch',
    pl: '🇵🇱 Polski',
  }

  return (
    <>
      <fieldset>
        <legend>Choose language</legend>

        {SUPPORTED_LOCALES.map(locale => (
          <label key={locale}>
            <input
              type="radio"
              name="locale"
              value={locale}
              checked={locale === currentLocale}
              onChange={() => onLocaleChange(locale)}
            />
            {labels[locale]}
          </label>
        ))}
      </fieldset>

      <Editor />
    </>
  )
}
