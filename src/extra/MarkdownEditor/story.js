import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import source from '../../stories/assets/markdownSample'
import { Box } from '../../'
import { MarkdownEditor } from './'
import Readme from './README.md'
import { withScreenshot } from 'storycap'

storiesOf('Extra/MarkdownEditor', module)
  .addDecorator(withReadme(Readme))
  // The editor lazy-loads the toolbar, so we wait a bit in order for it to get rendered.
  .addDecorator(withScreenshot({ delay: 1000 }))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <MarkdownEditor value={source} />
      </Box>
    )
  })
