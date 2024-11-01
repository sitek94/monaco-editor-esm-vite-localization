import loader from "@monaco-editor/loader"
import { type editor as Editor } from "monaco-editor"
import { useEffect, useRef } from "react"

export type MonacoEditorLanguage = "json" | "css" | "html" | "typescript" | "javascript"

export type MonacoEditorProps = Pick<Editor.IStandaloneEditorConstructionOptions, "value" | "theme"> & {
  height?: string | number
  width?: string | number
  language?: MonacoEditorLanguage
}

export function MonacoEditor({ height = "100%", width = "100%", ...options }: MonacoEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (rootRef.current) {
      initializeMonacoEditor(rootRef.current, {
        ...options,
        automaticLayout: true,
      }).then((editor) => {
        editorRef.current = editor
      })
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [options])

  return <div ref={rootRef} style={{ height, width }} />
}

async function initializeMonacoEditor(rootElement: HTMLElement, options: Editor.IStandaloneEditorConstructionOptions) {
  const monacoModule = await import("monaco-editor")

  loader.config({ monaco: monacoModule })

  const monaco = await loader.init()

  return monaco.editor.create(rootElement, options)
}
