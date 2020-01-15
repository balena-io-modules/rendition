import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import styled from 'styled-components'
import { ArcSlider, Box } from '../../'
import Readme from './README.md'

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
  .add('Standard', () => {
    return (
      <Container>
        <ArcSlider />
      </Container>
    )
  })
  .add('Fill color', () => {
    return (
      <Container>
        <ArcSlider fillColor='#ff0000' />
      </Container>
    )
  })
  .add('Background color', () => {
    return (
      <Container>
        <ArcSlider background='#ff0000' />
      </Container>
    )
  })
  .add('Label', () => {
    return (
      <Container>
        <ArcSlider>
          <h2>A label</h2>
        </ArcSlider>
      </Container>
    )
  })
  .add('Change handler', () => {
    return (
      <Container>
        <HOC />
      </Container>
    )
  })
