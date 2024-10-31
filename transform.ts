import fs from "fs"

const filepath = "./node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions.js"
const code = fs.readFileSync(filepath, "utf-8")

const path = "vs/editor/"

const newCode = code.replace(/(\bfunction\s+localize\()|(\blocalize\()/g, (text) => {
  const isFunctionStatement = /function\s+localize/.test(text)

  if (isFunctionStatement) {
    console.log(`Function statement, skipping...`)

    return text
  }

  return `localize('${path}', `
})

// write to output.js
fs.writeFileSync("./output.js", newCode)
