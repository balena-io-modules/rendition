import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Input } from '../../'
import Readme from './README.md'

storiesOf('Next/Input', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Input m={2} placeholder='Placeholder Text' />
        <Input m={2} placeholder='Placeholder Text' invalid />
        <Input m={2} placeholder='Placeholder Text' valid />
        <Input m={2} placeholder='Placeholder Text' disabled />
      </Box>
    )
  })
  .add('Emphasized', () => {
    return (
      <Box m={3}>
        <Input m={2} emphasized placeholder='Placeholder Text' />
        <Input m={2} emphasized placeholder='Placeholder Text' invalid />
        <Input m={2} emphasized placeholder='Placeholder Text' valid />
        <Input m={2} emphasized placeholder='Placeholder Text' disabled />
      </Box>
    )
  })
  .add('Monospace', () => {
    return (
      <Box m={3}>
        <Input m={2} monospace placeholder='Placeholder Text' />
        <Input m={2} monospace placeholder='Placeholder Text' invalid />
        <Input m={2} monospace placeholder='Placeholder Text' valid />
        <Input m={2} monospace placeholder='Placeholder Text' disabled />
      </Box>
    )
  })
  .add('Input types', () => {
    return (
      <Box m={3}>
        <label>
          <div>Text</div>
          <Input m={2} placeholder='Placeholder Text' type='text' />
        </label>
        <label>
          <div>Number</div>
          <Input m={2} placeholder='Placeholder Number' type='number' />
        </label>
        <label>
          <div>Date</div>
          <Input m={2} placeholder='Placeholder Date' type='date' />
        </label>
        <label>
          <div>Month</div>
          <Input m={2} placeholder='Placeholder Month' type='month' />
        </label>
        <label>
          <div>Password</div>
          <Input m={2} placeholder='Placeholder Password' type='password' />
        </label>
        <label>
          <div>Time</div>
          <Input m={2} placeholder='Placeholder Time' type='time' />
        </label>
      </Box>
    )
  })
