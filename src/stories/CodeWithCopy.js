import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import CodeWithCopy from '../components/CodeWithCopy'
import { Flex, Box } from '../components/Grid'
import Link from '../components/Link'

const Container = styled.div`
  margin: 30px;
`

storiesOf('CodeWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <CodeWithCopy
        text='click me'
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
              text='click me'
              copy='This value has been copied to your clipboard!'
            />
          </Box>
        </Flex>
      </Link>
    )
  })
