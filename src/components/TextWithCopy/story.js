import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Link, TextWithCopy } from '../../'
import Readme from './README.md'

storiesOf('Next/TextWithCopy', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <TextWithCopy copy='This value has been copied to your clipboard!'>
          <i>hover</i> & <b>click</b> the icon
        </TextWithCopy>
      </Box>
    )
  })
  .add('Wrapping text', () => {
    return (
      <Box m={3} width={300}>
        <TextWithCopy copy='This value has been copied to your clipboard!'>
          hover & click ... ... ... ... ... ... ... ... ... ... ... ... the icon
          on the wrapped text
        </TextWithCopy>
      </Box>
    )
  })
  .add('Always showing the copy icon', () => {
    return (
      <Box m={3} width={300}>
        <TextWithCopy
          showCopyButton='always'
          copy='This value has been copied to your clipboard!'
        >
          click the icon
        </TextWithCopy>
      </Box>
    )
  })
  .add('Inside clickable element', () => {
    return (
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
    )
  })
  .add('Code', () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  })
