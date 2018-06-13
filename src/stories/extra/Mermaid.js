import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Box } from '../../'
import { Markdown } from '../../extra/Markdown'
import { Mermaid } from '../../extra/Mermaid'

const readme = `
# Mermaid
Generate charts from text using [mermaidjs](https://mermaidjs.github.io/).
`

const source = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`

storiesOf('[extra] Mermaid', module)
  .addDecorator(story => <Box p={3}>{story()}</Box>)
  .addWithInfo('Default', () => {
    return (
      <React.Fragment>
        <Markdown>{readme}</Markdown>

        <Mermaid value={source} />
      </React.Fragment>
    )
  })
