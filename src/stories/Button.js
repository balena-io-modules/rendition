import { h } from 'preact'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import Button from '../components/Button'

const Container = styled.div`margin: 30px;`

storiesOf('Button', module)
  .addWithInfo('Standard', () => {
    return (
      <Container>
        <Button mx={2} primary onPress={action('case-1')}>
          Button
        </Button>
        <Button mx={2} secondary onPress={action('case-2')}>
          Button
        </Button>
        <Button mx={2} tertiary onPress={action('case-3')}>
          Button
        </Button>
        <Button mx={2} onPress={action('case-4')}>
          Button
        </Button>
      </Container>
    )
  })
  .addWithInfo('Emphasized', () => {
    return (
      <Container>
        <Button mx={2} emphasized primary onPress={action('case-1')}>
          Button
        </Button>
        <Button mx={2} emphasized secondary onPress={action('case-2')}>
          Button
        </Button>
        <Button mx={2} emphasized tertiary onPress={action('case-3')}>
          Button
        </Button>
        <Button mx={2} emphasized onPress={action('case-4')}>
          Button
        </Button>
      </Container>
    )
  })
  .addWithInfo('Outline', () => {
    return (
      <Container>
        <Button mx={2} primary outline onPress={action('case-1')}>
          Button
        </Button>
        <Button mx={2} secondary outline onPress={action('case-2')}>
          Button
        </Button>
        <Button mx={2} tertiary outline onPress={action('case-3')}>
          Button
        </Button>
        <Button mx={2} outline onPress={action('case-4')}>
          Button
        </Button>
      </Container>
    )
  })
  .addWithInfo('Underline', () => {
    return (
      <Container>
        <Button mx={2} primary underline onPress={action('case-1')}>
          Button
        </Button>
        <Button mx={2} secondary underline onPress={action('case-2')}>
          Button
        </Button>
        <Button mx={2} tertiary underline onPress={action('case-3')}>
          Button
        </Button>
        <Button mx={2} underline onPress={action('case-4')}>
          Button
        </Button>
      </Container>
    )
  })
