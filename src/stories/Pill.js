import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Box, Pill } from '../'
import * as Readme from './README/Pill.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Pill', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Standard', () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  })
  .add('Small', () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  })
