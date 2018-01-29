import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { CodeWithCopy, Flex, Box, Link } from '../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('CodeWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <CodeWithCopy
        text='22ab7io'
        copy='This value has been copied to your clipboard!'
      />
    )
  })
  .addWithInfo('Inside clickable element', () => {
    return (
      <Link href='#foobar' style={{ display: 'block' }}>
        <Flex>
          <Box mr={5}>Link Text</Box>
          <Box>
            <CodeWithCopy
              color='#333'
              text='22ab7io'
              copy='This value has been copied to your clipboard!'
            />
          </Box>
        </Flex>
      </Link>
    )
  })
