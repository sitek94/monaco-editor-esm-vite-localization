import isPrime from "just-is-prime"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { CodeEditor } from "./code-editor"

import spanish from "./locales/es.json"

const locale = (window.localStorage.getItem("locale") as "es" | "en") || "en"

window.__TRANSLATIONS__ = locale === "es" ? spanish : ({} as any)

export function App() {
  const setLocale = (lang: "en" | "es") => {
    window.localStorage.setItem("locale", lang)

    // refresh the page
    window.location.reload()
  }

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
      <h1>__APP_TITLE__</h1>

      <button onClick={() => setLocale("es")}>🇪🇸 Spain</button>
      <button onClick={() => setLocale("en")}>🇬🇧 English</button>

      <h2>Is 2 prime? {`${isPrime(2)}`}</h2>

      <CodeEditor />
    </>
  )
}
