import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import * as React from 'react'
import styled from 'styled-components'
import { Divider } from '../'
import * as Readme from './README/Divider.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Divider', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return <Divider color='#ccc' />
  })
