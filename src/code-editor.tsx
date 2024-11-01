import loader from "@monaco-editor/loader"

import { editor, type editor as Editor } from "monaco-editor"
// import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useEffect, useRef } from "react"

import { translationsMap } from "./monaco-editor/locales"

self.MonacoEnvironment = {
  getWorker(_, label) {
    const worker = new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url), {
      type: "module",
    })

    worker.postMessage({
      type: "INIT",
      translations: translationsMap["es"],
    })

    return worker
  },
}

export function CodeEditor() {
  const ref = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    ;(async () => {
      const monaco = await import("monaco-editor")

      loader.config({ monaco })

      if (ref.current) {
        loader.init().then((monaco) => {
          editorRef.current = monaco.editor.create(ref.current!, {
            value: `function hello() {\n\talert('Hello world!');\n}`,
            // language: "javascript",
          })
        })
      }
    })()

    return () => {
      editorRef.current?.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: "80vh" }} />
}
