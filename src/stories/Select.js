import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Box, Provider, Select } from '../'
import * as Readme from './README/Select.md'

storiesOf('Core/Select', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Select>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
          </Select>
        </Box>
      </Provider>
    )
  })
  .add('Emphasized', () => {
    return (
      <Provider>
        <Box m={3}>
          <Select emphasized>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
          </Select>
        </Box>
      </Provider>
    )
  })
  .add('Disabled', () => {
    return (
      <Provider>
        <Box m={3}>
          <Select disabled>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
          </Select>
        </Box>
      </Provider>
    )
  })
