import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { TextWithCopy, Flex, Box, Link } from '../'
import * as Readme from './README/TextWithCopy.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/TextWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <TextWithCopy copy='This value has been copied to your clipboard!'>
        <i>hover</i> & <b>click</b> the icon
      </TextWithCopy>
    )
  })
  .add('Wrapping text', () => {
    return (
      <div style={{ width: '300px' }}>
        <TextWithCopy copy='This value has been copied to your clipboard!'>
          hover & click ... ... ... ... ... ... ... ... ... ... ... ... the icon
          on the wrapped text
        </TextWithCopy>
      </div>
    )
  })
  .add('Always showing the copy icon', () => {
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
  .add('Inside clickable element', () => {
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
