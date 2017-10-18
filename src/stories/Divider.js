import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Divider from '../components/Divider'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Divider', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Divider color='#ccc' />
  })
