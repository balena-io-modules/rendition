import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Badge, Box, Provider } from '../'
import * as Readme from './README/Badge.md'

storiesOf('Core/Badge', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Badge text='badge1' mr={2} />
          <Badge text='badge2' mr={2} />
          <Badge text='badge3' />
        </Box>
      </Provider>
    )
  })
  .add('Controlled', () => {
    return (
      <Provider>
        <Box m={3}>
          <Badge primary text='Primary' mr={2} />
          <Badge secondary text='Secondary' mr={2} />
          <Badge tertiary text='Tertiary' mr={2} />
          <Badge bg='purple' color='green' text='Custom' />
        </Box>
      </Provider>
    )
  })
