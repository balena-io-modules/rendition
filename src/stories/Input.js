import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Input from '../components/Input'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Input', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <div>
        <Input m={2} placeholder='Placeholder Text' />
        <Input m={2} placeholder='Placeholder Text' invalid />
        <Input m={2} placeholder='Placeholder Text' valid />
        <Input m={2} placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .addWithInfo('Emphasized', () => {
    return (
      <div>
        <Input m={2} emphasized placeholder='Placeholder Text' />
        <Input m={2} emphasized placeholder='Placeholder Text' invalid />
        <Input m={2} emphasized placeholder='Placeholder Text' valid />
        <Input m={2} emphasized placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .addWithInfo('Monospace', () => {
    return (
      <div>
        <Input m={2} monospace placeholder='Placeholder Text' />
        <Input m={2} monospace placeholder='Placeholder Text' invalid />
        <Input m={2} monospace placeholder='Placeholder Text' valid />
        <Input m={2} monospace placeholder='Placeholder Text' disabled />
      </div>
    )
  })
  .addWithInfo('Input types', () => {
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
      </div>
    )
  })
