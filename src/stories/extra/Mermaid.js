import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box } from '../../'
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
  .addDecorator(story => <Box p={3}>{story()}</Box>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <React.Fragment>
        <Mermaid value={source} />
      </React.Fragment>
    )
  })
