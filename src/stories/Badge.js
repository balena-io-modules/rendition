import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Badge } from '../'
import * as Readme from './README/Badge.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Badge', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Standard', () => {
    return (
      <React.Fragment>
        <Badge text='badge1' mr={2} />
        <Badge text='badge2' mr={2} />
        <Badge text='badge3' />
      </React.Fragment>
    )
  })
  .add('Controlled', () => {
    return (
      <React.Fragment>
        <Badge primary text='Primary' mr={2} />
        <Badge secondary text='Secondary' mr={2} />
        <Badge tertiary text='Tertiary' mr={2} />
        <Badge bg='purple' color='green' text='Custom' />
      </React.Fragment>
    )
  })
