import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import { Box, Divider, Provider } from '../../'
import Readme from './README.md'

storiesOf('Next/Divider', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Divider color='#ccc' />
          <Divider mt={4} />
          <Divider type='dashed' mt={4} />
          <Divider type='dashed' mt={4}>
            some textual context
          </Divider>
        </Box>
      </Provider>
    )
  })
