/**
 * @type {import("prettier").Config}
 */
export default {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 100,
  useTabs: false,
  singleQuote: true,
  arrowParens: 'avoid',
  bracketSpacing: false,
  semi: false,
  trailingComma: 'all',
  proseWrap: 'always',
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 120,
      },
    },
  ],
}
