import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { CodeWithCopy, Flex, Box, Link, Provider } from '../'
import * as Readme from './README/CodeWithCopy.md'

storiesOf('Core/CodeWithCopy', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <CodeWithCopy
            text='22ab7io'
            copy='This value has been copied to your clipboard!'
          />
        </Box>

        <Box m={3}>
          <CodeWithCopy
            text={3555432}
            copy='This value has been copied to your clipboard!'
          />
        </Box>
        <Box m={3}>
          <CodeWithCopy copy='Specify only the copy prop' />
        </Box>
        <Box m={3}>
          <CodeWithCopy text='Or only the text prop' />
        </Box>
      </Provider>
    )
  })
  .add('Inside clickable element', () => {
    return (
      <Provider>
        <Box m={3}>
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
        </Box>
      </Provider>
    )
  })
  .add('Show icon on hover', () => {
    return (
      <Provider>
        <Box m={3}>
          <CodeWithCopy
            text='22ab7io'
            copy='This value has been copied to your clipboard!'
            showCopyButton='hover'
          />
        </Box>
      </Provider>
    )
  })
