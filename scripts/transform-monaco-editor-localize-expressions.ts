import {Project, SyntaxKind} from 'ts-morph'

const project = new Project()

project.addSourceFileAtPath('./monaco-editor/esm/vs/editor/common/config/editorOptions.js')

const sourceFiles = project.getSourceFiles()
const isLocalize = (text: string) => text === 'localize' || text === 'nls.localize'

sourceFiles.forEach(sourceFile => {
  const translationPath = sourceFile
    .getFilePath()
    .replace(/.*\/esm\//, '')
    .replace('.js', '')

  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)

  callExpressions.forEach(callExpression => {
    const expression = callExpression.getExpression()
    const expressionText = expression.getText()

    if (isLocalize(expressionText)) {
      callExpression.insertArgument(0, `'${translationPath}'`)
    }
  })

  sourceFile.saveSync()
})
