import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Box, Flex } from '../'
import * as Readme from './README/Flex.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Flex', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Flex>
        <Box style={{ height: 200, width: 200 }} bg='red' />
        <Box style={{ height: 200, width: 200 }} bg='blue' />
        <Box style={{ height: 200, width: 200 }} bg='green' />
      </Flex>
    )
  })
  .add('Justify', () => {
    return (
      <Flex justify='space-between'>
        <Box style={{ height: 200, width: 200 }} bg='red' />
        <Box style={{ height: 200, width: 200 }} bg='blue' />
        <Box style={{ height: 200, width: 200 }} bg='green' />
      </Flex>
    )
  })
  .add('Flex direction', () => {
    return (
      <Flex flexDirection='column'>
        <Box style={{ height: 200, width: 200 }} bg='red' />
        <Box style={{ height: 200, width: 200 }} bg='blue' />
        <Box style={{ height: 200, width: 200 }} bg='green' />
      </Flex>
    )
  })
  .add('Flex wrap', () => {
    return (
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
    )
  })
  .add('Flex property on children', () => {
    return (
      <Flex>
        <Box style={{ height: 200, width: 200 }} flex='1' bg='red' />
        <Box style={{ height: 200, width: 200 }} bg='blue' />
        <Box style={{ height: 200, width: 200 }} bg='green' />
      </Flex>
    )
  })
