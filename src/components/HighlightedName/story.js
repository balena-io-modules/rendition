import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { HighlightedName, Box, Provider } from '../../'
import Readme from './README.md'

storiesOf('Next/HighlightedName', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <HighlightedName mr={2}>Frontend</HighlightedName>
          <HighlightedName mr={2}>Backend</HighlightedName>
          <HighlightedName mr={2}>Logger</HighlightedName>
          <HighlightedName mr={2}>Emitter</HighlightedName>
          <HighlightedName mr={2}>Builder</HighlightedName>
        </Box>
        <Box m={3}>
          <HighlightedName mr={2}>API</HighlightedName>
          <HighlightedName mr={2}>Reporter</HighlightedName>
          <HighlightedName mr={2}>Sense</HighlightedName>
          <HighlightedName mr={2}>Sound</HighlightedName>
          <HighlightedName mr={2}>Bluetooth</HighlightedName>
        </Box>
        <Box m={3}>
          <HighlightedName mr={2}>balenaOS</HighlightedName>
          <HighlightedName mr={2}>balenaEtcher</HighlightedName>
          <HighlightedName mr={2}>balenaCloud</HighlightedName>
          <HighlightedName mr={2}>balenaFin</HighlightedName>
          <HighlightedName mr={2}>balenaEngine</HighlightedName>
        </Box>
        <Box m={3}>
          <HighlightedName mr={2}>Base Images</HighlightedName>
          <HighlightedName mr={2}>Docs</HighlightedName>
          <HighlightedName mr={2}>Blog</HighlightedName>
          <HighlightedName mr={2}>Forum</HighlightedName>
          <HighlightedName mr={2}>Projects</HighlightedName>
        </Box>
        <Box my={5} mx={3}>
          <HighlightedName mr={2}>Default with Different Text</HighlightedName>
          <HighlightedName mr={2} bg='#eee'>
            Custom Light Background
          </HighlightedName>
          <HighlightedName mr={2} color='black'>
            Custom Text Color
          </HighlightedName>
          <HighlightedName mr={2} bg='maroon' color='yellow'>
            Custom Background and Text Color
          </HighlightedName>
        </Box>
      </Provider>
    )
  })
