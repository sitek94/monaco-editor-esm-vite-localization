import "./index.css"

import { createRoot } from "react-dom/client"

import Editor from "@monaco-editor/react"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
)

export function App2() {
  return (
    <div style={{ padding: "1rem" }}>
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="" />
    </div>
  )
}
