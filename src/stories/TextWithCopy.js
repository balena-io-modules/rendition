import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Link, Provider, TextWithCopy } from '../'
import * as Readme from './README/TextWithCopy.md'

storiesOf('Core/TextWithCopy', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <TextWithCopy copy='This value has been copied to your clipboard!'>
            <i>hover</i> & <b>click</b> the icon
          </TextWithCopy>
        </Box>
      </Provider>
    )
  })
  .add('Wrapping text', () => {
    return (
      <Provider>
        <Box m={3} w={300}>
          <TextWithCopy copy='This value has been copied to your clipboard!'>
            hover & click ... ... ... ... ... ... ... ... ... ... ... ... the
            icon on the wrapped text
          </TextWithCopy>
        </Box>
      </Provider>
    )
  })
  .add('Always showing the copy icon', () => {
    return (
      <Provider>
        <Box m={3} w={300}>
          <TextWithCopy
            showCopyButton='always'
            copy='This value has been copied to your clipboard!'
          >
            click the icon
          </TextWithCopy>
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
                <TextWithCopy copy='This value has been copied to your clipboard!'>
                  hover & click the icon
                </TextWithCopy>
              </Box>
            </Flex>
          </Link>
        </Box>
      </Provider>
    )
  })
