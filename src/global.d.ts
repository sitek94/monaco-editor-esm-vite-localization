declare global {
  interface Window {
    __TRANSLATIONS__: Record<string, string>
    __LOCALE__: string
  }
}

export {}
