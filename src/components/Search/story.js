import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Search } from '../../'
import Readme from './README.md'

storiesOf('Core/Search', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3} width={500}>
        <Search />
      </Box>
    )
  })
  .add('Disabled', () => {
    return (
      <Box m={3} width={500}>
        <Search disabled />
      </Box>
    )
  })
  .add('Dark', () => {
    return (
      <Box m={3} width={500} bg='rgb(52, 52, 52)'>
        <Search dark />
      </Box>
    )
  })
  .add('Placeholder', () => {
    return (
      <Box m={3} width={500}>
        <Search placeholder='Placeholder Text' />
      </Box>
    )
  })
