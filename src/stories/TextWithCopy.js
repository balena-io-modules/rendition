import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { TextWithCopy, Flex, Box, Link } from '../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('TextWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <TextWithCopy copy='This value has been copied to your clipboard!'>
        <i>hover</i> & <b>click</b> the icon
      </TextWithCopy>
    )
  })
  .addWithInfo('wrapping text', () => {
    return (
      <div style={{ width: '300px' }}>
        <TextWithCopy copy='This value has been copied to your clipboard!'>
          hover & click ... ... ... ... ... ... ... ... ... ... ... ... the icon
          on the wrapped text
        </TextWithCopy>
      </div>
    )
  })
  .addWithInfo('always showing the copy icon', () => {
    return (
      <div style={{ width: '300px' }}>
        <TextWithCopy
          showCopyButton='always'
          copy='This value has been copied to your clipboard!'
        >
          click the icon
        </TextWithCopy>
      </div>
    )
  })
  .addWithInfo('Inside clickable element', () => {
    return (
      <Link href='#foobar' style={{ display: 'block' }}>
        <Flex>
          <Box mr={5}>Link Text</Box>
          <Box>
            <TextWithCopy copy='This value has been copied to your clipboard!'>
              hover & click the icon
            </TextWithCopy>
          </Box>
        </Flex>
      </Link>
    )
  })
