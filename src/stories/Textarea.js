import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Textarea } from '../'
import * as Readme from './README/Textarea.md'

const Container = styled.div`
  margin: 30px;
  max-width: 666px;
`

storiesOf('Core/Textarea', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return <Textarea placeholder='Placeholder Text' />
  })
