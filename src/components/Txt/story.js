import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Txt } from '../..'
import Readme from './README.md'

storiesOf('Core/Txt', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Txt>Standard txt</Txt>
          <Txt align='center'>Centered</Txt>
          <Txt align='right'>Right</Txt>
          <Txt bold>Bold</Txt>
          <Txt italic>Italic</Txt>
          <Txt monospace>Monospace</Txt>
          <Txt.span color='blue'>Inline </Txt.span>
          <Txt.span color='red'>Inline </Txt.span>
          <Txt.span color='yellow'>Inline </Txt.span>
          <Txt whitespace='pre'>{'Space   is   preserved'}</Txt>
        </Box>
      </Provider>
    )
  })
