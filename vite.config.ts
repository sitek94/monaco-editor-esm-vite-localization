import {defineConfig} from 'vite'
import {type Plugin} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), helloWorldPlugin()],
})

function helloWorldPlugin(): Plugin {
  return {
    name: 'Hello World Vite Plugin',
    buildStart() {
      // console.log('[Hello World Vite Plugin]: 🚀🚀🚀')
    },
    transform(code, id) {
      if (id.endsWith('/app.tsx')) {
        return code.replace(/__APP_TITLE__/g, 'Monaco Editor')
      }

      return null
    },
  }
}
