import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Fixed } from '../'
import * as Readme from './README/Fixed.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Fixed', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return <Fixed bg='red' top left bottom right />
  })
