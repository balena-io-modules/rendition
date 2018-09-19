import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider } from '../../'
import { Mermaid } from '../../extra/Mermaid'
import * as Readme from '../README/Mermaid.md'

const source = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`

storiesOf('Extra/Mermaid', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Mermaid value={source} />
        </Box>
      </Provider>
    )
  })
