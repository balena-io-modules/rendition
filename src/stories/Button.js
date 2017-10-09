import { h } from 'preact'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { FaDownload, FaExpand, FaTrash, FaRecycle } from 'react-icons/lib/fa'
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
  .addWithInfo('Width', () => {
    return (
      <Container>
        <Button w={95} mx={2} primary onPress={action('case-1')}>
          Button
        </Button>
        <Button w={60} mx={2} secondary onPress={action('case-2')}>
          Button
        </Button>
        <Button w={120} mx={2} tertiary onPress={action('case-3')}>
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
  .addWithInfo('Square', () => {
    return (
      <Container>
        <Button mx={2} primary square onPress={action('case-1')}>
          <FaDownload />
        </Button>
        <Button mx={2} secondary square onPress={action('case-2')}>
          <FaTrash />
        </Button>
        <Button mx={2} tertiary square onPress={action('case-3')}>
          <FaExpand />
        </Button>
        <Button m={2} square onPress={action('case-4')}>
          <FaRecycle />
        </Button>
      </Container>
    )
  })
