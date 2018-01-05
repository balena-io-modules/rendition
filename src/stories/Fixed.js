import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Fixed } from '../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Fixed', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Fixed bg='red' top left bottom right />
  })
