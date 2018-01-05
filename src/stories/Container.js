import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Container, Heading } from '../'

storiesOf('Container', module)
  .addWithInfo('Standard', () => {
    return (
      <Container>
        <Heading>I am in a container</Heading>
      </Container>
    )
  })
  .addWithInfo('Center Text', () => {
    return (
      <Container align='center'>
        <Heading>I am in a container</Heading>
      </Container>
    )
  })
