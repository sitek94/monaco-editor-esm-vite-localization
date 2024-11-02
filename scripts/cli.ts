import {Command} from 'commander'
import path from 'path'
import fs from 'fs'

import {forEachMonacoLocalizeExpression} from './for-each-monaco-localize-expression'

type TranslationsNested = {[path: string]: {[key: string]: string}}
type TranslationsFlat = {[key: string]: string}

const program = new Command()

program.name('translation-utils').description('Utilities for managing Monaco editor translations')

program
  .command('create-translations-map-template')
  .alias('template')
  .description('Create translations map template from Monaco editor source code')
  .argument('<monaco-path>', 'Path to Monaco editor source code')
  .option('-o, --output <path>', 'Output path for the template file', 'translation.json')
  .option('-e, --empty', 'Create an empty template file (without default messages)', false)
  .action(async (monacoPath: string, options: {output: string; empty: boolean}) => {
    try {
      const absoluteMonacoPath = path.resolve(process.cwd(), monacoPath)
      if (!fs.existsSync(absoluteMonacoPath)) {
        console.error(`Error: Monaco path does not exist: ${absoluteMonacoPath}`)
        process.exit(1)
      }

      console.log(`Processing Monaco source from: ${absoluteMonacoPath}`)
      console.log(`Output will be written to: ${options.output}`)

      const translations: TranslationsNested = {}

      forEachMonacoLocalizeExpression(absoluteMonacoPath, params => {
        const {path, key, message: defaultMessage} = params
        const value = options.empty ? '' : defaultMessage
        if (!translations[path]) {
          translations[path] = {[key]: value}
        } else {
          translations[path][key] = value
        }
      })

      const output = JSON.stringify(translations, null, 2)
      fs.writeFileSync(options.output, output)

      console.log('Translation map template created successfully')
    } catch (error) {
      console.error('Error creating translation map template:', error)
      process.exit(1)
    }
  })

program
  .command('fill-translations-map')
  .alias('fill')
  .description(
    'Create FLAT_KEY_TO_TRANSLATION_MAP_FOR_OTHER_LANGUAGE using template and existing translations',
  )
  .option('-t, --template <path>', 'Path to template file')
  .option('-o, --output <path>', 'Output path for the filled translation map', 'output.json')
  .option(
    '-s, --source <path>',
    'Path to source translations file (e.g., vscode-language-pack-es/translations/main.i18n.json)',
  )
  .action(async (options: {template: string; output: string; source: string}) => {
    const template = readJsonFile<TranslationsNested>(options.template)
    const source = readJsonFile<TranslationsNested>(options.source)
    const output = structuredClone(template)

    for (const [path, nestedObj] of Object.entries(source)) {
      for (const [key, value] of Object.entries(nestedObj)) {
        if (output[path]?.[key] !== undefined) {
          output[path][key] = value
        }
      }
    }

    fs.writeFileSync(options.output, JSON.stringify(output, null, 2))

    console.log('Translation map filled successfully')
  })

program
  .command('create-direct-translations-map')
  .alias('direct')
  .description('Create direct translations map between two language files')
  .option('-k, --keysFile <path>', 'Path to source language file (e.g., en.json)')
  .option('-v, --valuesFile <path>', 'Path to target language file (e.g., es.json)')
  .option(
    '-o, --output <path>',
    'Output path for the direct translations map',
    'direct-output.json',
  )
  .action(async (options: {keysFile: string; valuesFile: string; output: string}) => {
    const keys = readJsonFile<TranslationsNested>(options.keysFile)
    const values =
      (options.valuesFile && readJsonFile<TranslationsNested>(options.valuesFile)) || {}
    const directTranslations: TranslationsFlat = {}

    for (const [path, nestedObj] of Object.entries(keys)) {
      for (const [key, value] of Object.entries(nestedObj)) {
        if (values[path]?.[key] !== undefined) {
          directTranslations[value] = values[path][key]
        } else {
          console.warn(`Missing translation for key "${key}" in path "${path}"`)
          directTranslations[value] = ''
        }
      }
    }

    fs.writeFileSync(options.output, JSON.stringify(directTranslations, null, 2))

    console.log('Direct translations map created successfully')
  })

// Error handling for unknown commands
program.on('command:*', () => {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' '),
  )
  process.exit(1)
})

// Parse command line arguments
program.parse()

function readJsonFile<T>(filepath: string) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`File does not exist: ${filepath}`)
  }

  return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T
}

program
  .command('fetch-i18n')
  .alias('fetch')
  .description('Fetch i18n from vscode-loc')
  .option('-l, --language <language>', 'Language code (e.g., en, es)')
  .option('-a, --all', 'Fetch all languages', false)
  .option('-o, --output <path>', 'Output path for the fetched i18n', 'i18n')
  .action(async (options: {language: string; all: boolean; output: string}) => {
    // TODO: Implement fetching i18n from vscode-loc
    console.log(options)
  })
