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
