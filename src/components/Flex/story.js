import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex } from '../..'
import Readme from './README.md'

storiesOf('Next/Flex', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Flex>
          <Box style={{ height: 200, width: 200 }} bg='red' />
          <Box style={{ height: 200, width: 200 }} bg='blue' />
          <Box style={{ height: 200, width: 200 }} bg='green' />
        </Flex>
      </Box>
    )
  })
  .add('Justify', () => {
    return (
      <Box m={3}>
        <Flex justifyContent='space-between'>
          <Box style={{ height: 200, width: 200 }} bg='red' />
          <Box style={{ height: 200, width: 200 }} bg='blue' />
          <Box style={{ height: 200, width: 200 }} bg='green' />
        </Flex>
      </Box>
    )
  })
  .add('Flex direction', () => {
    return (
      <Box m={3}>
        <Flex flexDirection='column'>
          <Box style={{ height: 200, width: 200 }} bg='red' />
          <Box style={{ height: 200, width: 200 }} bg='blue' />
          <Box style={{ height: 200, width: 200 }} bg='green' />
        </Flex>
      </Box>
    )
  })
  .add('Flex wrap', () => {
    return (
      <Box m={3}>
        <Flex flexWrap='wrap'>
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
    )
  })
  .add('Flex property on children', () => {
    return (
      <Box m={3}>
        <Flex>
          <Box style={{ height: 200, width: 200 }} flex='1' bg='red' />
          <Box style={{ height: 200, width: 200 }} bg='blue' />
          <Box style={{ height: 200, width: 200 }} bg='green' />
        </Flex>
      </Box>
    )
  })
