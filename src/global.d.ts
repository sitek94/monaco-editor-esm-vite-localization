declare global {
  interface Window {
    __MONACO_TRANSLATIONS__: {
      [path: string]: {
        [key: string]: string
      }
    }
    __MONACO_DEBUG__: boolean
    __LOCALE__: string
  }
}

export {}
