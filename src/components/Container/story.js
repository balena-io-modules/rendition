import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Container, Heading, Provider } from '../../'
import Readme from './README.md'

storiesOf('Core/Container', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Container>
          <Heading>I am in a container</Heading>
        </Container>
      </Provider>
    )
  })
  .add('Center Text', () => {
    return (
      <Provider>
        <Container textAlign='center'>
          <Heading>I am in a container</Heading>
        </Container>
      </Provider>
    )
  })
