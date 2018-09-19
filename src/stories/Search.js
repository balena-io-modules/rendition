import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Search } from '../'
import * as Readme from './README/Search.md'

storiesOf('Core/Search', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3} w={500}>
          <Search />
        </Box>
      </Provider>
    )
  })
  .add('Disabled', () => {
    return (
      <Provider>
        <Box m={3} w={500}>
          <Search disabled />
        </Box>
      </Provider>
    )
  })
  .add('Dark', () => {
    return (
      <Provider>
        <Box m={3} w={500} bg='rgb(52, 52, 52)'>
          <Search dark />
        </Box>
      </Provider>
    )
  })
  .add('Placeholder', () => {
    return (
      <Provider>
        <Box m={3} w={500}>
          <Search placeholder='Placeholder Text' />
        </Box>
      </Provider>
    )
  })
