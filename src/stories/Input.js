import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Input, Provider } from '../'
import * as Readme from './README/Input.md'

storiesOf('Core/Input', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Input m={2} placeholder='Placeholder Text' />
          <Input m={2} placeholder='Placeholder Text' invalid />
          <Input m={2} placeholder='Placeholder Text' valid />
          <Input m={2} placeholder='Placeholder Text' disabled />
        </Box>
      </Provider>
    )
  })
  .add('Emphasized', () => {
    return (
      <Provider>
        <Box m={3}>
          <Input m={2} emphasized placeholder='Placeholder Text' />
          <Input m={2} emphasized placeholder='Placeholder Text' invalid />
          <Input m={2} emphasized placeholder='Placeholder Text' valid />
          <Input m={2} emphasized placeholder='Placeholder Text' disabled />
        </Box>
      </Provider>
    )
  })
  .add('Monospace', () => {
    return (
      <Provider>
        <Box m={3}>
          <Input m={2} monospace placeholder='Placeholder Text' />
          <Input m={2} monospace placeholder='Placeholder Text' invalid />
          <Input m={2} monospace placeholder='Placeholder Text' valid />
          <Input m={2} monospace placeholder='Placeholder Text' disabled />
        </Box>
      </Provider>
    )
  })
  .add('Input types', () => {
    return (
      <Provider>
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
          <label>
            <div>Checkbox</div>
            <Input m={2} type='checkbox' />
          </label>
        </Box>
      </Provider>
    )
  })
