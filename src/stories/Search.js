import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Search } from '../'

const Container = styled.div`
  margin: 30px;
  width: 500px;
`

const DarkBackground = styled.div`
  background: rgb(52, 52, 52);
`

storiesOf('Search', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Search />
  })
  .addWithInfo('Disabled', () => {
    return <Search disabled />
  })
  .addWithInfo('Dark', () => {
    return (
      <DarkBackground>
        <Search dark />
      </DarkBackground>
    )
  })
  .addWithInfo('Placeholder', () => {
    return <Search dark placeholder='Placeholder Text' />
  })
