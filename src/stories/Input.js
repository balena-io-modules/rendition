import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Input } from '../'
import * as Readme from './README/Input.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Input', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <div>
        <Input m={2} placeholder='Placeholder Text' />
        <Input m={2} placeholder='Placeholder Text' invalid />
        <Input m={2} placeholder='Placeholder Text' valid />
        <Input m={2} placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .add('Emphasized', () => {
    return (
      <div>
        <Input m={2} emphasized placeholder='Placeholder Text' />
        <Input m={2} emphasized placeholder='Placeholder Text' invalid />
        <Input m={2} emphasized placeholder='Placeholder Text' valid />
        <Input m={2} emphasized placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .add('Monospace', () => {
    return (
      <div>
        <Input m={2} monospace placeholder='Placeholder Text' />
        <Input m={2} monospace placeholder='Placeholder Text' invalid />
        <Input m={2} monospace placeholder='Placeholder Text' valid />
        <Input m={2} monospace placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .add('Input types', () => {
    return (
      <div>
        <label>
          <div>Text</div>
          <Input m={2} placeholder='Placeholder Text' type='text' />
        </label>
        <label>
          <div>Number</div>
          <Input m={2} placeholder='Placeholder Number' type='number' />
        </label>
        <label>
          <div>Date</div>
          <Input m={2} placeholder='Placeholder Date' type='date' />
        </label>
        <label>
          <div>Month</div>
          <Input m={2} placeholder='Placeholder Month' type='month' />
        </label>
        <label>
          <div>Password</div>
          <Input m={2} placeholder='Placeholder Password' type='password' />
        </label>
        <label>
          <div>Time</div>
          <Input m={2} placeholder='Placeholder Time' type='time' />
        </label>
        <label>
          <div>Checkbox</div>
          <Input m={2} type='checkbox' />
        </label>
      </div>
    )
  })
