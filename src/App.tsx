import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"

import { Locale, translationsMap } from "./monaco-editor/locales"
import "./monaco-editor/initialize-monaco-worker"
import { MonacoEditor, MonacoEditorLanguage } from "./monaco-editor/monaco-editor"
import { useState } from "react"

const currentLocale = (window.localStorage.getItem("locale") || "en") as Locale

window.__MONACO_TRANSLATIONS__ = translationsMap[currentLocale]

function setLocale(locale: Locale) {
  window.__MONACO_TRANSLATIONS__ = translationsMap[locale]
  window.localStorage.setItem("locale", locale)
  window.location.reload()
}

const localeOptions = [
  { locale: "es", label: "🇪🇸 Spain" },
  { locale: "en", label: "🇬🇧 English" },
  { locale: "de", label: "🇩🇪 Germany" },
  { locale: "pl", label: "🇵🇱 Poland" },
] satisfies { locale: Locale; label: string }[]

const languageOptions = [
  { language: "json", label: "JSON 📄" },
  { language: "css", label: "CSS 🎨" },
  { language: "html", label: "HTML 🌐" },
  { language: "typescript", label: "TypeScript 🛠️" },
  { language: "javascript", label: "JavaScript ✨" },
] satisfies { language: MonacoEditorLanguage; label: string }[]

export function App() {
  const [editorLanguage, setEditorLanguage] = useState<MonacoEditorLanguage>("javascript")

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

      {localeOptions.map(({ locale, label }) => (
        <label key={locale}>
          <input
            checked={currentLocale === locale}
            type="radio"
            name="locale"
            value={locale}
            onChange={() => setLocale(locale)}
          />
          {label}
        </label>
      ))}

      <br />

      {languageOptions.map(({ language, label }) => (
        <label key={language}>
          <input
            checked={editorLanguage === language}
            type="radio"
            name="language"
            value={language}
            onChange={() => setEditorLanguage(language)}
          />
          {label}
        </label>
      ))}

      <br />
      <br />

      <MonacoEditor
        value="//"
        height="50vh"
        width="75vw"
        theme="vs-dark"
        language={editorLanguage}
        // language="javascript"
      />
    </>
  )
}
