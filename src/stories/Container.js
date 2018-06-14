import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Container, Heading } from '../'
import * as Readme from './README/Container.md'

storiesOf('Core/Container', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Container>
        <Heading>I am in a container</Heading>
      </Container>
    )
  })
  .add('Center Text', () => {
    return (
      <Container align='center'>
        <Heading>I am in a container</Heading>
      </Container>
    )
  })
