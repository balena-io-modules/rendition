import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Search } from '../'
import * as Readme from './README/Search.md'

const Container = styled.div`
  margin: 30px;
  width: 500px;
`

const DarkBackground = styled.div`
  background: rgb(52, 52, 52);
`

storiesOf('Core/Search', module)
  .addDecorator(withReadme(Readme))
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
