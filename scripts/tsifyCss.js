const { tsifyFileContent } = require('./tsifyFileContent')
const stripCssComments = require('strip-css-comments')
const prettier = require('prettier')

const postProcessor = (str, parser) =>
  prettier.format(parser === 'css' ? stripCssComments(str) : str, {
    parser,
    useTabs: true,
    singleQuote: true
  })

tsifyFileContent(
  './node_modules/xterm/dist/xterm.css',
  './src/components/Terminal/XTermDefaultStyle.ts',
  postProcessor
)

tsifyFileContent(
  './node_modules/easymde/dist/easymde.min.css',
  './src/extra/MarkdownEditor/defaultStyle.ts',
  postProcessor
)

tsifyFileContent(
  './node_modules/react-notifications-component/dist/theme.css',
  './src/components/Notifications/defaultStyle.ts',
  postProcessor
)
