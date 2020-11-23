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
  require.resolve('xterm/css/xterm.css'),
  './src/components/Terminal/XTermDefaultStyle.ts',
  postProcessor
)

tsifyFileContent(
  require.resolve('easymde/dist/easymde.min.css'),
  './src/extra/MarkdownEditor/defaultStyle.ts',
  postProcessor
)

tsifyFileContent(
  require.resolve('react-notifications-component/dist/theme.css'),
  './src/components/Notifications/defaultStyle.ts',
  postProcessor
)

tsifyFileContent(
  require.resolve('prismjs/themes/prism.css'),
  './src/extra/Markdown/defaultStyle.ts',
  postProcessor
)
