import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider } from '../../'
import { Markdown } from '../../extra/Markdown'
import * as Readme from '../README/Markdown.md'

const source = `
## Markdown
A simple component for rendering *GitHub flavored markdown*.
`

storiesOf('Extra/Markdown', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Markdown>{source}</Markdown>
        </Box>
      </Provider>
    )
  })
