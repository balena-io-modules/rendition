import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Provider } from '../'
import * as Readme from './README/Flex.md'

storiesOf('Core/Flex', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex>
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
          </Flex>
        </Box>
      </Provider>
    )
  })
  .add('Justify', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex justify='space-between'>
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
          </Flex>
        </Box>
      </Provider>
    )
  })
  .add('Flex direction', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex flexDirection='column'>
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
          </Flex>
        </Box>
      </Provider>
    )
  })
  .add('Flex wrap', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex wrap>
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
            <Box style={{ height: 200, width: 200 }} bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
          </Flex>
        </Box>
      </Provider>
    )
  })
  .add('Flex property on children', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex>
            <Box style={{ height: 200, width: 200 }} flex='1' bg='red' />
            <Box style={{ height: 200, width: 200 }} bg='blue' />
            <Box style={{ height: 200, width: 200 }} bg='green' />
          </Flex>
        </Box>
      </Provider>
    )
  })
