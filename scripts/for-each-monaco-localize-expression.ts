import {LeftHandSideExpression, Node, Project, SourceFile, SyntaxKind} from 'ts-morph'

type Params = {
  path: string
  key: string
  message: string
}

/**
 * Goes through all Monaco source files and finds all calls to `localize` and `nls.localize`
 *
 * @param onLocalizeExpression A function to call for each `localize` or `nls.localize` call
 */
export function forEachMonacoLocalizeExpression(
  pathToMonaco: string,
  onLocalizeExpression: (params: Params) => void,
) {
  const project = new Project()

  project.addSourceFilesAtPaths(`${pathToMonaco}/esm/vs/**/*.js`)

  const sourceFiles = project.getSourceFiles()
  const isLocalize = (text: string) => text === 'localize' || text === 'nls.localize'

  sourceFiles.forEach(sourceFile => {
    const path = sourceFile
      .getFilePath()
      .replace(/.*\/esm\//, '')
      .replace('.js', '')

    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)

    callExpressions.forEach(callExpression => {
      const expression = callExpression.getExpression()
      const expressionText = expression.getText()

      if (isLocalize(expressionText)) {
        const [firstArg, secondArg] = callExpression.getArguments()

        let key: string
        let value: string

        if (Node.isObjectLiteralExpression(firstArg)) {
          const keyProperty = firstArg.getProperty('key')

          if (Node.isPropertyAssignment(keyProperty)) {
            const initializer = keyProperty.getInitializer()
            if (Node.isStringLiteral(initializer)) {
              key = initializer.getLiteralValue()
            } else {
              handleError('"key" property should be a string literal', sourceFile, expression)
            }
          } else {
            handleError('Missing key property on first object argument', sourceFile, expression)
          }
        } else if (Node.isStringLiteral(firstArg)) {
          key = firstArg.getLiteralValue()
        } else {
          handleError(
            'First argument should be an object or string literal',
            sourceFile,
            expression,
          )
        }

        if (Node.isStringLiteral(secondArg)) {
          value = secondArg.getLiteralValue()
        } else {
          handleError('Second argument should be a string literal', sourceFile, expression)
        }

        onLocalizeExpression({path, key, message: value})
      }
    })
  })
}

function handleError(
  message: string,
  sourceFile: SourceFile,
  expression: LeftHandSideExpression,
): never {
  const lineOfCode = expression.getStartLineNumber()
  console.error(`Error in file: ${sourceFile.getFilePath()} at line: ${lineOfCode}`)
  console.error(`${message}`)

  process.exit(1)
}
