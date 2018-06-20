import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { CodeWithCopy, Flex, Box, Link } from '../'
import * as Readme from './README/CodeWithCopy.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/CodeWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <CodeWithCopy
        text='22ab7io'
        copy='This value has been copied to your clipboard!'
      />
    )
  })
  .add('Inside clickable element', () => {
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
