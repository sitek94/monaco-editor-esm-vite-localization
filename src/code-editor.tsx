import loader from "@monaco-editor/loader"

import type { editor as Editor } from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useEffect, useRef } from "react"

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
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    ;(async () => {
      const monaco = await import("monaco-editor")

      loader.config({ monaco })

      if (ref.current) {
        loader.init().then((monaco) => {
          editorRef.current = monaco.editor.create(ref.current!, {
            value: `function hello() {\n\talert('Hello world!');\n}`,
            language: "javascript",
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
