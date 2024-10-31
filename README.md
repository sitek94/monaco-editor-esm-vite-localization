# Monaco Editor Vte Localize

## MORE CONTEXT FROM SB ON GITHUB

```plaintext
I've seen multiple people ask about how to localize the ESM version of monaco. This is currently not officially supported as far as I know, especially if you want to support multiple languages (see also microsoft/monaco-editor#784). Which is why I had to find a workaround for this project, as require.js does not integrate well with JSF.

Strategy
To summarize what I ended up doing:

Create a bundle with webpack
Most localized text are hardcoded, but are still passed through a small helper function in vscode/nls.js. That function is also given an i18n key, but just returns the localized text. So I use the NormalModuleWebpackReplacementPlugin to replace that file with my own version that reads the localized text from a dynamic source.
Now we need to get the translations for each i18n key. I pull from github.com/Microsoft/vscode-loc. It consists of many files, so I process them and write all i18n strings to one JS file.
The i18n keys from that repo include the source file name of the file they are used in. This is not the case in the ESM version. So I preprocess the ESM code and replace all calls to nls.localize("my.key", args) with nls.localize("source/file.js", "my.key", args).
Some translations are missing (see microsoft/monaco-editor#822), but fortunately, for most keys, localized texts are available with another i18n key. This can be fixed while generating the locales by mapping to these keys.
To make the localized strings available to the webworkers as well, we can just wrap the webworker by creating our own webworker that first loads the locale, then proceeds to load the original webworker.
```

## Vite plugins

Initially I tried approach similar to [monaco-editor-esm-webpack-plugin](https://github.com/wang12124468/monaco-editor-esm-webpack-plugin) and write
a Vite plugin to modify source code of `monaco-editor` package to better support localization when using ESM module.

To quickly summarize the problem and solution.

Another issue is that there is no way currently to change translations at runtime, but I think it's not a big deal, because you can just reload the page to get the correct translations.

In monaco editor there is `nls.localize` function that is used to localize strings, which does some magic to get the correct translation based on the current locale, for example you can change the locale when initializing Monaco Editor like this:

```js
// Monaco Editor UMD example
// https://github.com/microsoft/monaco-editor/blob/main/samples/browser-amd-localized/index.html
require.config({ paths: { vs: "../node_modules/monaco-editor/min/vs" } })

require.config({
  "vs/nls": {
    availableLanguages: {
      "*": "de",
    },
  },
})
```

This pr

We can get translations from `vscode-loc` package, e.g. for Spanish, `es.json`:

```json
{
  "vs/base/browser/ui/dialog/dialog": {
    "dialogClose": "Cerrar cuadro de diálogo",
    "dialogErrorMessage": "Error",
    "dialogInfoMessage": "Información",
    "dialogPendingMessage": "En curso",
    "dialogWarningMessage": "Advertencia",
    "ok": "Aceptar"
  },
  "vs/base/browser/ui/dropdown/dropdownActionViewItem": {
    "moreActions": "Más Acciones..."
  },
  "vs/base/browser/ui/findinput/findInput": {
    "defaultLabel": "entrada"
  }
}
```

These files follow the following structure:

```json
{
  "path/to/file": {
    "key": "value"
  }
}
```

This is problematic, because there seems to be no way to easily add new or customize existing translations.

To overcome this issue I've seen plugin (described above that makes this helper dynamic with info about path)

```js
export function localize(data, message, ...args) {
  /* ... */
}
```

We can use it with combination of `vscode-loc` package to get translations.

We need to update the calls to `localize` and also update `localize` itself.

First approach was to create webpack plugin to modify monaco source code and update invocations and patch monaco to update `localize` function to be dynamic.

I tried with Vite plugin, see below section [Vite plugins](#vite-plugins) but I had some issues with it. So in the end I decided

## Vite Plugins

Since I haven't written any Vite plugins before, I decided to start with simpler examples to get a better understanding of how Vite plugins work.

- [x] create Vite plugins to modify source code of our app
- [x] create Vite plugin to modify source code of some simple npm package
- [x] create Vite plugin to modify source code of `monaco-editor`

At first glance the final plugin for Monaco worked, but I had some issues with it:

- when running in development mode, the plugin was not going over all the files, or should I say it was covering maybe around 20 files
- when building in production it was working fine, but it was adding ~10s to build time so I imagine if I made it work in development it'd significantly slow down the dev server

### Hello world plugin

```ts
function helloWorldPlugin(): Plugin {
  return {
    name: "Hello World Vite Plugin",
    buildStart() {
      console.log("[Hello World Vite Plugin]: 🚀🚀🚀")
    },
    transform(code, id) {
      if (id.endsWith("/app.tsx")) {
        return code.replace(/__APP_TITLE__/g, "Monaco Editor")
      }

      return null
    },
  }
}
```

### Hijack npm package plugin

```ts
function hijackJustIsPrimePackage(): Plugin {
  return {
    name: "Hijack just-is-prime",
    enforce: "pre",
    buildStart() {
      console.log("[Hijack just-is-prime]: 🚀🚀🚀")
    },
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
```

### Monaco Editor ESM plugin

```ts
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
      if (id.includes("monaco-editor")) {
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
```
