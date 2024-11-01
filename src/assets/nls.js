/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function _format(message = "", args = []) {
  let result
  if (args.length === 0) {
    result = message
  } else {
    try {
      result = message.replace(/\{(\d+)\}/g, (match, rest) => {
        const index = rest[0]
        const arg = args[index]
        let result = match
        if (typeof arg === "string") {
          result = arg
        } else if (typeof arg === "number" || typeof arg === "boolean" || arg === void 0 || arg === null) {
          result = String(arg)
        }
        return result
      })
    } catch (e) {
      if (globalThis?.__MONACO__DEBUG__) {
        console.warn("Localization format error", e)
      }
    }
  }
  if (isPseudo) {
    // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
    result = "\uFF3B" + result.replace(/[aouei]/g, "$&$&") + "\uFF3D"
  }
  return result || message
}

export function localize(path, data, defaultMessage, ...args) {
  const key = typeof data === "object" ? data.key : data
  const translations = getTranslations()
  const translation = getTranslation(path, key, defaultMessage)

  if (Object.keys(translations).length === 0) {
    console.log("Localize: No translations found")
  }

  if (!translation) warnMissingTranslation(path, key, defaultMessage)

  const message = translation || defaultMessage

  if (typeof data === "number") {
    return _format(lookupMessage(data, message), args)
  }

  return _format(message, args)
}

/**
 * Only used when built: Looks up the message in the global NLS table.
 * This table is being made available as a global through bootstrapping
 * depending on the target context.
 */
function lookupMessage(index, fallback) {
  const message = getNLSMessages()?.[index]
  if (typeof message !== "string") {
    if (typeof fallback === "string") {
      return fallback
    }
    throw new Error(`!!! NLS MISSING: ${index} !!!`)
  }
  return message
}

export function localize2(path, data, defaultMessage, ...args) {
  const key = typeof data === "object" ? data.key : data
  const translations = getTranslations()
  const translation = getTranslation(path, key, defaultMessage)

  if (Object.keys(translations).length === 0) {
    console.log("Localize2: No translations found")
  }

  if (!translation) warnMissingTranslation(path, key, defaultMessage)

  const message = translation || defaultMessage
  const value = _format(message, args)

  return {
    value,
    original: defaultMessage === message ? value : _format(defaultMessage, args),
  }
}

function getTranslation(path, key, defaultMessage) {
  try {
    return translations[path]?.[key]
  } catch (e) {
    if (globalThis?.__MONACO__DEBUG__) {
      console.warn("Translation lookup error", e)
    }
    return undefined
  }
}

function getTranslations() {
  return globalThis?.__MONACO_TRANSLATIONS__ || {}
}

function warnMissingTranslation(path, key, defaultMessage) {
  if (globalThis?.__MONACO__DEBUG__) {
    console.warn(`No translation found for "${path}.${key}"\n\nUsing default message: "${defaultMessage}"`)
  }
}
