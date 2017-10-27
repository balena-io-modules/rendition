import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Select from '../components/Select'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Select', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <Select>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
  .addWithInfo('Emphasized', () => {
    return (
      <Select emphasized>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
