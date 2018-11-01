import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import { Box, Divider, Provider } from '../'
import * as Readme from './README/Divider.md'

storiesOf('Core/Divider', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Divider color='#ccc' />
        </Box>
      </Provider>
    )
  })
