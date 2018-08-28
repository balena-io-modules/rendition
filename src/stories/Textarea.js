import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Textarea } from '../'
import * as Readme from './README/Textarea.md'

storiesOf('Core/Textarea', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Textarea placeholder='Placeholder text' />
        </Box>
      </Provider>
    )
  })
  .add('Monospace', () => {
    return (
      <Provider>
        <Box m={3}>
          <Textarea monospace placeholder='Placeholder text' />
        </Box>
      </Provider>
    )
  })
