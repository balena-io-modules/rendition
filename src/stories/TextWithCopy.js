import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Link, Provider, TextWithCopy } from '../'
import Readme from './README/TextWithCopy.md'

storiesOf('Next/TextWithCopy', module)
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
        <Box m={3} width={300}>
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
        <Box m={3} width={300}>
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
  .add('Code', () => {
    return (
      <Provider>
        <Box m={3}>
          <TextWithCopy
            code
            copy='This value has been copied to your clipboard!'
          >
            22ab7io
          </TextWithCopy>
        </Box>

        <Box m={3}>
          <TextWithCopy
            code
            copy='This value has been copied to your clipboard!'
          >
            3555432
          </TextWithCopy>
        </Box>
        <Box m={3}>
          <TextWithCopy code copy='Specify only the copy prop' />
        </Box>
        <Box m={3}>
          <TextWithCopy code text='Or only the text prop' />
        </Box>
      </Provider>
    )
  })
