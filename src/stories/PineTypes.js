import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import PineTypes from '../components/PineTypes'

const Container = styled.div`
  margin: 30px;
`

const actionHandler = action('Data changed')

class PineTypeDemo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: props.data
    }
  }

  handleChange (data) {
    actionHandler(data)
    this.setState({ data })
  }

  render () {
    return (
      <Container>
        <h2>Edit</h2>
        <this.props.Type.Edit
          value={this.state.data}
          onChange={val => this.handleChange(val)}
        />
        <h2>Display</h2>
        <this.props.Type.Display data={this.state.data} />
      </Container>
    )
  }
}

storiesOf('PineTypes', module)
  .addWithInfo('Boolean', () => {
    return <PineTypeDemo data Type={PineTypes.Boolean} />
  })
  .addWithInfo('Case Insensitive Text', () => {
    return (
      <PineTypeDemo
        data='Lorem ipsum dolor sit amet'
        Type={PineTypes['Case Insensitive Text']}
      />
    )
  })
  .addWithInfo('Date', () => {
    return <PineTypeDemo data='2017-09-14' Type={PineTypes.Date} />
  })
  .addWithInfo('Date Time', () => {
    return (
      <PineTypeDemo data='2017-09-14T12:00' Type={PineTypes['Date Time']} />
    )
  })
  .addWithInfo('Integer', () => {
    return <PineTypeDemo data={1234} Type={PineTypes.Integer} />
  })
  .addWithInfo('Real', () => {
    return <PineTypeDemo data={56.78} Type={PineTypes.Real} />
  })
  .addWithInfo('Semver', () => {
    return <PineTypeDemo data='1.56.12' Type={PineTypes.Semver} />
  })
  .addWithInfo('Semver Range', () => {
    return <PineTypeDemo data='> 1.56.12' Type={PineTypes['Semver Range']} />
  })
  .addWithInfo('Short Text', () => {
    return <PineTypeDemo data='Lorem ipsum' Type={PineTypes['Short Text']} />
  })
  .addWithInfo('Text', () => {
    return (
      <PineTypeDemo data='Lorem ipsum dolor sit amet' Type={PineTypes.Text} />
    )
  })
  .addWithInfo('Time', () => {
    return <PineTypeDemo data='12:33' Type={PineTypes.Time} />
  })
