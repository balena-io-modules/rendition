import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box } from '../../'
import { Markdown } from '../../extra/Markdown'
import * as Readme from '../README/Markdown.md'

const source = `
## Markdown
A simple component for rendering *GitHub flavored markdown*.
`

storiesOf('Extra/Markdown', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(story => <Box p={3}>{story()}</Box>)
  .add('Standard', () => {
    return <Markdown>{source}</Markdown>
  })
