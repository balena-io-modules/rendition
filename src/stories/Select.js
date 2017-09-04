import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Select from '../components/Select'

const Container = styled.div`margin: 30px;`

storiesOf('Select', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <Select>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Select>
    )
  })
  .addWithInfo('Emphasized', () => {
    return (
      <Select emphasized>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Select>
    )
  })
