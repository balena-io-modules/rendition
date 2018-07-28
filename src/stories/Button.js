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
        <Button m={2} primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} danger onClick={action('case-5')}>
          Danger
        </Button>
        <Button m={2} onClick={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Emphasized', () => {
    return (
      <Container>
        <Button m={2} emphasized primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} emphasized secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} emphasized tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} emphasized success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} emphasized danger onClick={action('case-5')}>
          Danger
        </Button>
        <Button m={2} emphasized onClick={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Disabled', () => {
    return (
      <Container>
        <Button m={2} disabled primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} disabled secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} disabled tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} disabled success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} disabled danger onClick={action('case-5')}>
          Danger
        </Button>
        <Button m={2} disabled onClick={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Outline', () => {
    return (
      <Container>
        <Button m={2} outline primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} outline secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} outline tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} outline success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} outline danger onClick={action('case-5')}>
          Danger
        </Button>
        <Button m={2} outline onClick={action('case-6')}>
          Default
        </Button>
      </Container>
    )
  })
  .add('Underline', () => {
    return (
      <Container>
        <Button m={2} primary underline onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} underline onClick={action('case-1')}>
          Button
        </Button>
      </Container>
    )
  })
  .add('Plaintext', () => {
    return (
      <Container>
        <Button m={2} plaintext primary onClick={action('case-1')}>
          Button
        </Button>
        <Button
          m={2}
          plaintext
          primary
          iconElement={<FaSpinner />}
          onClick={action('case-2')}
        >
          Button
        </Button>
      </Container>
    )
  })
  .add('Width', () => {
    return (
      <Container>
        <Button w={95} m={2} primary onClick={action('case-1')}>
          Button
        </Button>
        <Button w={60} m={2} secondary onClick={action('case-2')}>
          Button
        </Button>
        <Button w={120} m={2} tertiary onClick={action('case-3')}>
          Button
        </Button>
        <div style={{ width: 300 }}>
          <Button w='100%' m={2} onClick={action('case-4')}>
            Button
          </Button>
        </div>
      </Container>
    )
  })
  .add('Square', () => {
    return (
      <Container>
        <Button m={2} tertiary square onClick={action('case-3')}>
          <FaExpand />
        </Button>
        <Button m={2} square onClick={action('case-4')}>
          <FaRecycle />
        </Button>
      </Container>
    )
  })
  .add('Square Emphasized', () => {
    return (
      <Container>
        <Button m={2} emphasized tertiary square onClick={action('case-3')}>
          <FaExpand />
        </Button>
        <Button m={2} emphasized square onClick={action('case-4')}>
          <FaRecycle />
        </Button>
      </Container>
    )
  })
