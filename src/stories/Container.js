import * as React from 'react'
import { storiesOf } from '@storybook/react'
import Container from '../components/Container'
import Heading from '../components/Heading'

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
