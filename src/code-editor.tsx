import loader, { type Monaco } from "@monaco-editor/loader"
import type { editor as Editor } from "../vendors/monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useEffect, useRef } from "react"

// import { setLocaleData } from "monaco-editor-nls"
// import spanish from "./locales/es.json"

// setLocaleData(spanish)

self.MonacoEnvironment = {
  getWorker(_, label) {
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
  },
}

export function CodeEditor() {
  const ref = useRef<HTMLDivElement | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    console.log(`Monaco init`)
    ;(async () => {
      const monaco = await import("../vendors/monaco-editor")

      loader.config({
        monaco: monaco!,
        // "vs/nls": {

        // },
      })

      // console.log({ monaco })

      const div = ref.current

      if (div) {
        loader.init().then((monaco) => {
          console.log({ monaco })
          monacoRef.current = monaco

          editorRef.current = monaco.editor.create(div, {
            value: 'console.log("Hello, world!")',
          })
        })
      }
    })()

    return () => {
      console.log(`Monaco cleanup`)

      editorRef.current?.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: "80vh" }} />
}
