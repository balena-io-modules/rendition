import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Container, Heading, Provider } from '../'
import * as Readme from './README/Container.md'

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
        <Container align='center'>
          <Heading>I am in a container</Heading>
        </Container>
      </Provider>
    )
  })
