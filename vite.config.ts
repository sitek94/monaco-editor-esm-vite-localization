import {defineConfig} from 'vite'
import {type Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [hijackJustIsPrimePackage(), inspect(), react(), helloWorldPlugin()],
})

function helloWorldPlugin(): Plugin {
  return {
    name: 'Hello World Vite Plugin',
    transform(code, id) {
      if (id.endsWith('/app.tsx')) {
        return code.replace(/__APP_TITLE__/g, 'Monaco Editor')
      }

      return null
    },
  }
}

function hijackJustIsPrimePackage(): Plugin {
  return {
    name: 'Hijack just-is-prime',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('just-is-prime')) {
        const newCode = code.replace(
          'function isPrime(number) {',
          `function isPrime(number) { return "Dunno bro... 🤷";`,
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
