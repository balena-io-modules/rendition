import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import source from '../../stories/assets/markdownSample'
import { Box, Provider } from '../../'
import { MarkdownEditor } from './'
import Readme from './README.md'

storiesOf('Extra/MarkdownEditor', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <MarkdownEditor value={source} />
        </Box>
      </Provider>
    )
  })
