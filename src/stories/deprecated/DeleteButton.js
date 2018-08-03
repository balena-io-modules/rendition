import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import { Box, DeleteButton, Provider } from '../../'

storiesOf('Deprecated/DeleteButton', module).add('Standard', () => {
  return (
    <Provider>
      <Box m={3}>
        <DeleteButton onClick={action('DeleteButton clicked')} />
      </Box>
    </Provider>
  )
})
