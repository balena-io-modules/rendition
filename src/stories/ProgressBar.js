import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { ProgressBar } from '../'
import * as Readme from './README/ProgressBar.md'

const Container = styled.div`
  margin: 30px;
`

export class Progressor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value
    }
  }

  componentDidMount () {
    this.progressInterval = setInterval(() => {
      let value = this.state.value + 1
      if (value > 100) {
        value = 0
      }
      this.setState({ value })
    }, 250)
  }

  componentWillUnmount () {
    window.clearInterval(this.progressInterval)
  }

  render () {
    const { value, ...other } = this.props
    return (
      <ProgressBar {...other} value={this.state.value}>
        {this.state.value}%
      </ProgressBar>
    )
  }
}

storiesOf('Core/ProgressBar', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Container>
        <Progressor mb={3} primary value={50} />
        <Progressor mb={3} secondary value={45} />
        <Progressor mb={3} tertiary value={40} />
        <Progressor mb={3} danger value={35} />
        <Progressor mb={3} warning value={30} />
        <Progressor mb={3} success value={25} />
        <Progressor mb={3} info value={20} />
      </Container>
    )
  })
  .add('Emphasized', () => {
    return (
      <Container>
        <Progressor mb={3} emphasized primary value={50} />
        <Progressor mb={3} emphasized secondary value={45} />
        <Progressor mb={3} emphasized tertiary value={40} />
        <Progressor mb={3} emphasized danger value={35} />
        <Progressor mb={3} emphasized warning value={30} />
        <Progressor mb={3} emphasized success value={25} />
        <Progressor mb={3} emphasized info value={20} />
      </Container>
    )
  })
