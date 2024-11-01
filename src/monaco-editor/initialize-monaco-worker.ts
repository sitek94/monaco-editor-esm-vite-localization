import { Locale, translationsMap } from "./locales"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
type WorkerLabel = "json" | "css" | "html" | "typescript" | "javascript"

const currentLocale = (window.localStorage.getItem("locale") || "en") as Locale
const translations = translationsMap[currentLocale]

self.MonacoEnvironment = {
  getWorker(_, label: WorkerLabel) {
    // self.postMessage("Hello from MonacoEnvironment.getWorker")

    const worker = getWorker(label)

    worker.postMessage({
      type: "INIT",
      translations,
      debug: true,
    })

    return worker
  },
}

// function getWorker(label: WorkerLabel) {
//   switch (label) {
//     case "json":
//       return new Worker(new URL("monaco-editor/esm/vs/language/json/json.worker.js", import.meta.url), {
//         type: "module",
//       })
//     case "css":
//       return new Worker(new URL("monaco-editor/esm/vs/language/css/css.worker.js", import.meta.url), { type: "module" })
//     case "html":
//       return new Worker(new URL("monaco-editor/esm/vs/language/html/html.worker.js", import.meta.url), {
//         type: "module",
//       })
//     case "javascript":
//     case "typescript":
//       return new Worker(new URL("monaco-editor/esm/vs/language/typescript/ts.worker.js", import.meta.url), {
//         type: "module",
//       })
//     default:
//       return new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url), { type: "module" })
//   }
// }

function getWorker(label: string) {
  if (label === "json") {
    return new jsonWorker()
  }
  if (label === "css" || label === "scss" || label === "less") {
    return new cssWorker()
  }
  if (label === "html" || label === "handlebars" || label === "razor") {
    return new htmlWorker()
  }
  if (label === "typescript" || label === "javascript") {
    return new tsWorker()
  }
  return new editorWorker()
}
