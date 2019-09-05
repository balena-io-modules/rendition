const fs = require('fs')
const path = require('path')

const REPLACE_TARGET = '{% COMPONENT_DOCS %}'

function findByExtension(base, ext, files, result) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(
    function (file) {
      var newbase = path.join(base, file)
      if (fs.statSync(newbase).isDirectory()) {
        result = findByExtension(newbase, ext, fs.readdirSync(newbase), result)
      }
      else {
        if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
          result.push(newbase)
        }
      }
    }
  )

  return result
}

const readmeFilePaths = findByExtension('./src', 'md')
const tableOfContents = []

const docs = readmeFilePaths.map(readmePath => {
  const file = fs.readFileSync(readmePath, 'utf8')

  // Extract the component name from the README title
  const componentName = file.match(/(^#\s*)([\S|:blank:]*)/)[2].trim();
  tableOfContents.push(`- [${componentName}](#${componentName.toLowerCase()})`)

  // Reduce size of markdown headers to better fit the main README format
  return file.replace(/(^|\n)#/g, '$&##')
})

const content =
  tableOfContents.join('\n') +
  '\n\n' +
  docs.join('\n')

const readmeTpl = fs.readFileSync('./docs/_README.tpl.md', 'utf8')

const compiled = readmeTpl.replace(REPLACE_TARGET, content)

fs.writeFileSync('./README.md', compiled)
