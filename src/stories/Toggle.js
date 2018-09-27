import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Box, Txt, Toggle, Provider } from '../'
import * as Readme from './README/Toggle.md'

storiesOf('Core/Toggle', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Toggle mx={2} on onToggle={action('case-1')} />
          <Txt.span>No theme</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on primary onToggle={action('case-2')} />
          <Txt.span>Primary</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on secondary onToggle={action('case-3')} />
          <Txt.span>Secondary</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on tertiary onToggle={action('case-4')} />
          <Txt.span>Tertiary</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on quartenary onToggle={action('case-5')} />
          <Txt.span>Quartenary</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on success onToggle={action('case-6')} />
          <Txt.span>Success</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on danger onToggle={action('case-7')} />
          <Txt.span>Danger</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on warning onToggle={action('case-8')} />
          <Txt.span>Warning</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mx={2} on info onToggle={action('case-9')} />
          <Txt.span>Info</Txt.span>
        </Box>
      </Provider>
    )
  })
  .add('Emphazised', () => {
    return (
      <Provider>
        <Box m={3}>
          <Toggle on={false} emphazised onToggle={action('case-1')} />
        </Box>
      </Provider>
    )
  })
  .add('Custom toggled backgound', () => {
    return (
      <Provider>
        <Box m={3}>
          <Toggle
            mr={2}
            on
            activeBg={'palevioletred'}
            onToggle={action('case-1')}
          />
          <Txt.span>Enabled</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle
            mr={2}
            on
            activeBg={'palevioletred'}
            disabled
            onToggle={action('case-2')}
          />
          <Txt.span>Disabled</Txt.span>
        </Box>
      </Provider>
    )
  })
  .add('Disabled', () => {
    return (
      <Provider>
        <Box m={3}>
          <Toggle mr={2} on onToggle={action('case-1')} />
          <Txt.span>Enabled</Txt.span>
        </Box>
        <Box m={3}>
          <Toggle mr={2} on disabled onToggle={action('case-2')} />
          <Txt.span>Disabled</Txt.span>
        </Box>
      </Provider>
    )
  })
