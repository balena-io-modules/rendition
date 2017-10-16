import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Tooltip from '../components/Tooltip'

const Container = styled.div`
  margin: 60px;
`

storiesOf('Tooltip', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Hover', () => {
    return (
      <Tooltip message='Lorem ipsum dolor sit' eventType='hover'>
        <a>Hover over me</a>
      </Tooltip>
    )
  })
  .addWithInfo('Click', () => {
    return (
      <Tooltip message='Lorem ipsum dolor sit' eventType='click'>
        <a>Click me</a>
      </Tooltip>
    )
  })
