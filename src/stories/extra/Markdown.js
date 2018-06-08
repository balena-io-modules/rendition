import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Box } from '../../'
import { Markdown } from '../../extra/Markdown'

const source = `
# Markdown
A simple component for rendering GitHub flavored markdown.
`

storiesOf('[extra] Markdown', module)
  .addDecorator(story => <Box p={3}>{story()}</Box>)
  .addWithInfo('Default', () => {
    return <Markdown>{source}</Markdown>
  })
