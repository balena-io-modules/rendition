import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import source from '../../stories/assets/markdownSample'
import { Box } from '../../'
import { Markdown } from './'
import Readme from './README.md'

storiesOf('Extra/Markdown', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Markdown>{source}</Markdown>
      </Box>
    )
  })
