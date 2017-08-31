import { h } from 'preact'
import { storiesOf, action } from '@kadira/storybook'
import styled, { injectGlobal } from 'styled-components'
import Button from '../components/button'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Roboto,Arial,sans-serif;
  }
`

const Container = styled.div`margin: 30px;`

storiesOf('ResinBtn', module)
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
