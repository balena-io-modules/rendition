import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Img } from '../'
import * as Logo from './assets/etcher.svg'
import * as Readme from './README/Img.md'

const Container = styled.div`
  margin: 30px;
  background: ${props => props.theme.colors.gray.dark};
`

storiesOf('Core/Img', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Standard', () => {
    return <Img p={5} src={Logo} />
  })
