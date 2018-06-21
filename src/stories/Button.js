import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import * as FaExpand from 'react-icons/lib/fa/expand'
import * as FaRecycle from 'react-icons/lib/fa/recycle'
import * as FaSpinner from 'react-icons/lib/fa/spinner'
import { Button } from '../'
import * as Readme from './README/Button.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Button', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Container>
        <Button m={2} primary onPress={action('case-1')}>
          Primary
        </Button>
        <Button m={2} secondary onPress={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} tertiary onPress={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} success onPress={action('case-4')}>
          Success
        </Button>
        <Button m={2} danger onPress={action('case-5')}>
          Danger
        </Button>
        <Button m={2} onPress={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Emphasized', () => {
    return (
      <Container>
        <Button m={2} emphasized primary onPress={action('case-1')}>
          Primary
        </Button>
        <Button m={2} emphasized secondary onPress={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} emphasized tertiary onPress={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} emphasized success onPress={action('case-4')}>
          Success
        </Button>
        <Button m={2} emphasized danger onPress={action('case-5')}>
          Danger
        </Button>
        <Button m={2} emphasized onPress={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Disabled', () => {
    return (
      <Container>
        <Button m={2} disabled primary onPress={action('case-1')}>
          Primary
        </Button>
        <Button m={2} disabled secondary onPress={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} disabled tertiary onPress={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} disabled success onPress={action('case-4')}>
          Success
        </Button>
        <Button m={2} disabled danger onPress={action('case-5')}>
          Danger
        </Button>
        <Button m={2} disabled onPress={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Outline', () => {
    return (
      <Container>
        <Button m={2} outline primary onPress={action('case-1')}>
          Primary
        </Button>
        <Button m={2} outline secondary onPress={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} outline tertiary onPress={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} outline success onPress={action('case-4')}>
          Success
        </Button>
        <Button m={2} outline danger onPress={action('case-5')}>
          Danger
        </Button>
        <Button m={2} outline onPress={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Underline', () => {
    return (
      <Container>
        <Button m={2} primary underline onPress={action('case-1')}>
          Button
        </Button>
        <Button m={2} underline onPress={action('case-1')}>
          Button
        </Button>
      </Container>
    )
  })
  .add('Plaintext', () => {
    return (
      <Container>
        <Button m={2} plaintext primary onPress={action('case-1')}>
          Button
        </Button>
        <Button
          m={2}
          plaintext
          primary
          iconElement={<FaSpinner />}
          onPress={action('case-2')}
        >
          Button
        </Button>
      </Container>
    )
  })
  .add('Width', () => {
    return (
      <Container>
        <Button w={95} m={2} primary onPress={action('case-1')}>
          Button
        </Button>
        <Button w={60} m={2} secondary onPress={action('case-2')}>
          Button
        </Button>
        <Button w={120} m={2} tertiary onPress={action('case-3')}>
          Button
        </Button>
        <div style={{ width: 300 }}>
          <Button w='100%' m={2} onPress={action('case-4')}>
            Button
          </Button>
        </div>
      </Container>
    )
  })
  .add('Square', () => {
    return (
      <Container>
        <Button m={2} tertiary square onPress={action('case-3')}>
          <FaExpand />
        </Button>
        <Button m={2} square onPress={action('case-4')}>
          <FaRecycle />
        </Button>
      </Container>
    )
  })
  .add('Square Emphasized', () => {
    return (
      <Container>
        <Button m={2} emphasized tertiary square onPress={action('case-3')}>
          <FaExpand />
        </Button>
        <Button m={2} emphasized square onPress={action('case-4')}>
          <FaRecycle />
        </Button>
      </Container>
    )
  })
