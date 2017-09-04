import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Input from '../components/Input'

const Container = styled.div`margin: 30px;`

storiesOf('Input', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Input placeholder='Placeholder Text' />
  })
  .addWithInfo('Emphasized', () => {
    return <Input emphasized placeholder='Placeholder Text' />
  })
