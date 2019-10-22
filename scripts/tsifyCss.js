const { tsifyFileContent } = require('./tsifyFileContent')
const stripCssComments = require('strip-css-comments')
const prettier = require('prettier')

tsifyFileContent(
  './node_modules/xterm/dist/xterm.css',
  './src/components/Terminal/XTermDefaultStyle.ts',
  str => '\n' + prettier.format(stripCssComments(str), { parser: 'css', useTabs: true })
)

tsifyFileContent(
  './node_modules/easymde/dist/easymde.min.css',
  './src/extra/MarkdownEditor/defaultStyle.ts',
  str => '\n' + prettier.format(stripCssComments(str), { parser: 'css', useTabs: true })
)
