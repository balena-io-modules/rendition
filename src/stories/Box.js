import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Txt } from '../'
import * as Readme from './README/Box.md'

storiesOf('Core/Box', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box bg='#909090' m={3} p={3} color='white'>
          <Txt>I'm in a Box!</Txt>
        </Box>
      </Provider>
    )
  })
