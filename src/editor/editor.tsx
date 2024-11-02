import { useRef, useState, useEffect } from "react"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

export const Editor = () => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = useRef(null)

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor

        return monaco.editor.create(monacoEl.current!, {
          value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
          language: "javascript",
          automaticLayout: true,
          theme: "vs-dark",
        })
      })
    }

    return () => editor?.dispose()
  }, [editor])

  return <div style={{ height: "100%", width: "100%" }} ref={monacoEl}></div>
}
