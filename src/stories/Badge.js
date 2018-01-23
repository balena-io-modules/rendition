import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Badge } from '../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Badge', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <div>
        <Badge text='badge1' mr={2} />
        <Badge text='badge2' mr={2} />
        <Badge text='badge3' />
      </div>
    )
  })
  .addWithInfo('Controlled', () => {
    return (
      <div>
        <Badge primary text='Primary' mr={2} />
        <Badge secondary text='Secondary' mr={2} />
        <Badge tertiary text='Tertiary' mr={2} />
        <Badge bg='purple' color='green' text='Custom' />
      </div>
    )
  })
