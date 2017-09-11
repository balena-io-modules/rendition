import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Textarea from '../components/Textarea'

const Container = styled.div`
  margin: 30px;
  max-width: 666px;
`

storiesOf('Textarea', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Textarea placeholder='Placeholder Text' />
  })
