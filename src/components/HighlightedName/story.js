import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { HighlightedName, Box, Provider } from '../../'
import Readme from './README.md'

storiesOf('Next/HighlightedName', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <HighlightedName mr={2}>Default</HighlightedName>
          <HighlightedName mr={2}>Default with Different Text</HighlightedName>
          <HighlightedName mr={2} bg='#eee'>
            Custom Light Background
          </HighlightedName>
          <HighlightedName mr={2} color='black'>
            Custom Text Color
          </HighlightedName>
        </Box>
      </Provider>
    )
  })
