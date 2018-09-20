const fs = require('fs')
const path = require('path')

const README_DIR = './src/stories/README'
const REPLACE_TARGET = '{% COMPONENT_DOCS %}'

const fileNames = fs.readdirSync('./src/stories/README')

const docs = fileNames.map(name => {
  const file = fs.readFileSync(path.join(README_DIR, name), 'utf8')
  // Reduce size of markdown headers to better fit the main README format
  return file.replace(/(^|\n)#/g, '$&##')
})

const content =
  fileNames
    .map(file => {
      const name = file.replace('.md', '')
      return `- [${name}](#${name.toLowerCase()})`
    })
    .join('\n') +
  '\n\n' +
  docs.join('\n')

const readmeTpl = fs.readFileSync('./docs/_README.tpl.md', 'utf8')

const compiled = readmeTpl.replace(REPLACE_TARGET, content)

fs.writeFileSync('./README.md', compiled)
