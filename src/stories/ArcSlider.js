import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import styled from 'styled-components'
import { ArcSlider, Box, Provider } from '../'
import * as Readme from './README/ArcSlider.md'

const Container = styled(Box).attrs({
  m: 3
})`
  max-width: 450px;
`

class HOC extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0.6
    }

    this.handleChange = value => {
      this.setState({ value })
    }
  }

  render () {
    return (
      <ArcSlider value={this.state.value} onValueChange={this.handleChange}>
        <h2>{Math.round(this.state.value * 100)}%</h2>
      </ArcSlider>
    )
  }
}

storiesOf('Core/ArcSlider', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Container>
          <ArcSlider />
        </Container>
      </Provider>
    )
  })
  .add('Fill color', () => {
    return (
      <Provider>
        <Container>
          <ArcSlider fillColor='#ff0000' />
        </Container>
      </Provider>
    )
  })
  .add('Background color', () => {
    return (
      <Provider>
        <Container>
          <ArcSlider background='#ff0000' />
        </Container>
      </Provider>
    )
  })
  .add('Label', () => {
    return (
      <Provider>
        <Container>
          <ArcSlider>
            <h2>A label</h2>
          </ArcSlider>
        </Container>
      </Provider>
    )
  })
  .add('Change handler', () => {
    return (
      <Provider>
        <Container>
          <HOC />
        </Container>
      </Provider>
    )
  })
