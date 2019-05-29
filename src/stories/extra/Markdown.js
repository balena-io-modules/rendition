import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider } from '../../'
import { Markdown } from '../../extra/Markdown'
import Readme from '../README/Markdown.md'

import image from '../assets/GitHub-Mark-120px-plus.png'

const source = `
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
`

storiesOf('Extra/Markdown', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Markdown>{source}</Markdown>
        </Box>
      </Provider>
    )
  })
