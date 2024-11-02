/// <reference types="vite/client" />

declare global {
  interface Window {
    __TRANSLATIONS__: Record<string, string>
  }
}
