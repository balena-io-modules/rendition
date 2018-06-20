import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Select } from '../'
import * as Readme from './README/Select.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Select', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Select>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
  .add('Emphasized', () => {
    return (
      <Select emphasized>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
  .add('Disabled', () => {
    return (
      <Select disabled>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    )
  })
