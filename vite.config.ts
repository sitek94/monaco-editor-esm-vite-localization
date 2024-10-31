import { defineConfig } from "vite"
import { type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import inspect from "vite-plugin-inspect"

// https://vite.dev/config/
export default defineConfig({
  // mode: "development",
  plugins: [
    // hijackJustIsPrimePackage(),
    //
    monacoEditorEsmPlugin(),

    inspect(),
    react(),
    // helloWorldPlugin(),
  ],
  // optimizeDeps: {
  // force: true,
  // entries: ["node_modules/monaco-editor"],
  // include: ["monaco-editor"],
  // },
  // build: {
  //   commonjsOptions: {
  //     include: ["node_modules/monaco-editor/**"],
  //   },
  // },
})

function helloWorldPlugin(): Plugin {
  return {
    name: "Hello World Vite Plugin",
    transform(code, id) {
      if (id.endsWith("/app.tsx")) {
        return code.replace(/__APP_TITLE__/g, "Monaco Editor")
      }

      return null
    },
  }
}

function hijackJustIsPrimePackage(): Plugin {
  return {
    name: "Hijack just-is-prime",
    enforce: "pre",

    transform(code, id) {
      if (id.includes("just-is-prime")) {
        const newCode = code.replace(
          "function isPrime(number) {",
          `function isPrime(number) { return "Dunno bro... 🤷";`
        )

        return {
          code: newCode,
          map: null,
        }
      }

      return null
    },
  }
}

/**
 * Based on `monaco-editor-esm-webpack-plugin`:
 * https://github.com/wang12124468/monaco-editor-esm-webpack-plugin/blob/master/src/loader.js
 */
function monacoEditorEsmPlugin(): Plugin {
  return {
    name: "Monaco Editor ESM",
    enforce: "pre",
    buildStart() {
      console.log("[Monaco Editor ESM Vite Plugin]: 🚀 Starting build with localization support")
    },

    transform(code, id) {
      if (/monaco-editor\/esm\/vs.+\.js/.test(id)) {
        const regex = /monaco-editor\/esm\/(.+)\.js/
        const match = id.match(regex)

        if (match) {
          const path = match[1]

          if (code.includes("localize(")) {
            const newCode = code.replace(/(\bfunction\s+localize\()|(\blocalize\()/g, (text) => {
              const isFunctionStatement = /function\s+localize/.test(text)

              if (isFunctionStatement) {
                console.log(`Function statement, skipping...`)

                return text
              }

              console.log(`Replacing localize with localize('${path}', ...)`)

              return `localize('${path}', `
            })

            return {
              code: newCode,
              map: null,
            }
          }
        }
      }

      return null
    },
  }
}
