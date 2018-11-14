import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Pill, Provider } from '../'
import * as Readme from './README/Pill.md'

storiesOf('Core/Pill', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Box mb={2}>
            <Pill mr={2} primary>
              Primary
            </Pill>
            <Pill mr={2} secondary>
              Secondary
            </Pill>
            <Pill mr={2} tertiary>
              Tertiary
            </Pill>
            <Pill mr={2} quarternary>
              Quarternary
            </Pill>
            <Pill mr={2}>Default</Pill>
          </Box>
          <Box>
            <Pill mr={2} danger>
              Danger
            </Pill>
            <Pill mr={2} warning>
              Warning
            </Pill>
            <Pill mr={2} success>
              Success
            </Pill>
            <Pill mr={2} info>
              Info
            </Pill>
            <Pill bg='purple' color='yellow'>
              Custom
            </Pill>
          </Box>
        </Box>
      </Provider>
    )
  })
  .add('Small', () => {
    return (
      <Provider>
        <Box m={3}>
          <Box mb={2}>
            <Pill small mr={2} primary>
              Primary
            </Pill>
            <Pill small mr={2} secondary>
              Secondary
            </Pill>
            <Pill small mr={2} tertiary>
              Tertiary
            </Pill>
            <Pill small mr={2} quarternary>
              Quarternary
            </Pill>
            <Pill small mr={2}>
              Default
            </Pill>
          </Box>
          <Box>
            <Pill small mr={2} danger>
              Danger
            </Pill>
            <Pill small mr={2} warning>
              Warning
            </Pill>
            <Pill small mr={2} success>
              Success
            </Pill>
            <Pill small mr={2} info>
              Info
            </Pill>
            <Pill small bg='purple' color='yellow'>
              Custom
            </Pill>
          </Box>
        </Box>
      </Provider>
    )
  })
