import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import { ArcSlider, Box } from '../../'
import Readme from './README.md'

class HOC extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0.6
    }

    this.handleChange = (value) => {
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
      <Box maxWidth={450} m={3}>
        <ArcSlider />
      </Box>
    )
  })
  .add('Fill color', () => {
    return (
      <Box maxWidth={450} m={3}>
        <ArcSlider fillColor='#ff0000' />
      </Box>
    )
  })
  .add('Background color', () => {
    return (
      <Box maxWidth={450} m={3}>
        <ArcSlider background='#ff0000' />
      </Box>
    )
  })
  .add('Label', () => {
    return (
      <Box maxWidth={450} m={3}>
        <ArcSlider>
          <h2>A label</h2>
        </ArcSlider>
      </Box>
    )
  })
  .add('Change handler', () => {
    return (
      <Box maxWidth={450} m={3}>
        <HOC />
      </Box>
    )
  })
