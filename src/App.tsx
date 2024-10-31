import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { CodeEditor } from "./code-editor"

import { Locale, translations } from "./locales"

const initialLocale = window.localStorage.getItem("locale") || "en"
window.__MONACO_TRANSLATIONS__ = translations[initialLocale as Locale]
window.__MONACO_DEBUG__ = true

const setLocale = (locale: Locale) => {
  window.localStorage.setItem("locale", locale)
  window.__MONACO_TRANSLATIONS__ = translations[locale]
  window.location.reload()
}

const options = [
  { locale: "es", label: "🇪🇸 Spain" },
  { locale: "en", label: "🇬🇧 English" },
  { locale: "de", label: "🇩🇪 Germany" },
  { locale: "pl", label: "🇵🇱 Poland" },
] satisfies { locale: Locale; label: string }[]

export function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {options.map(({ locale, label }) => (
        <label key={locale}>
          <input
            checked={initialLocale === locale}
            type="radio"
            name="locale"
            value={locale}
            onChange={() => setLocale(locale)}
          />
          {label}
        </label>
      ))}

      <br />
      <br />

      <CodeEditor />
    </>
  )
}
