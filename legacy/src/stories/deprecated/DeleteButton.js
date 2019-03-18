import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Box, DeleteButton, Provider } from '../../'

storiesOf('Deprecated/DeleteButton', module)
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <DeleteButton onClick={action('DeleteButton clicked')} />
        </Box>
      </Provider>
    )
  })
