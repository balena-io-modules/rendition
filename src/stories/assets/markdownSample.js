import image from './GitHub-Mark-120px-plus.png'

export const customizationSamples = [
  {
    markdown:
      "<h1>A title</h1><img src='https://via.placeholder.com/150'><p>A paragraph</p>",
    sanitizerOptions: {
      tagNames: ['p']
    }
  },
  {
    markdown:
      "<h1>A title</h1><img src='https://via.placeholder.com/150'><p>A paragraph</p>",
    sanitizerOptions: {
      tagNames: ['img'],
      attributes: { '*': ['src'] }
    }
  },
  {
    markdown:
      "<h1>A title</h1><img src='https://via.placeholder.com/150'><p>A paragraph</p>",
    sanitizerOptions: {
      tagNames: ['h1']
    }
  }
]

export default `
# Markdown
A simple component for rendering *GitHub flavored markdown*.

## Headers

# This is an \`<h1>\` tag
## This is an \`<h2>\` tag
###### This is an \`<h6>\` tag

## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
  * Item 2a
  * Item 2b

### Ordered

1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b

## Images

![Example Image](${image})

## Links

http://github.com - automatic!

[GitHub](http://github.com)

## Blockquotes

As Ash Ketchum said:

> Do you always need a reason to help somebody?

## Inline code

I think you should use an
\`<addr>\` element here instead.

## Code blocks

\`\`\`
// This is plaintext
const foo = () => {
  return 'bar'
}
\`\`\`

\`\`\`javascript
// This is javascript
const foo = () => {
  return 'bar'
}
\`\`\`

## Task Lists

- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

## Tables

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column


## Strikethrough

~~Crossed out~~

Any word wrapped with two tildes (like \`~~this~~\`) will appear crossed out.

## Inline HTML

<strong>An image:</strong>
<br>
<img src="${image}" />
<br>
<em>A link:</em>
<a target="_blank" href="http://github.com/">http://github.com/</a>

## Keyboard keys

<kbd>cmd</kbd> + <kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>a</kbd>
`
