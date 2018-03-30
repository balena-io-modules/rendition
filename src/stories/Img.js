import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Img } from '../'
import * as Logo from './assets/etcher.svg'

const Container = styled.div`
  margin: 30px;
  background: ${props => props.theme.colors.gray.dark};
`

storiesOf('Img', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Img p={5} src={Logo} />
  })
