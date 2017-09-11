import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Select from '../components/Select'

const Container = styled.div`margin: 30px;`

storiesOf('Select', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <Select value={1}>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
  .addWithInfo('Emphasized', () => {
    return (
      <Select value={1} emphasized>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
