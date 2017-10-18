import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Image from '../components/Image'
import * as Logo from './assets/etcher.svg'

const Container = styled.div`
  margin: 30px;
  background: ${props => props.theme.colors.gray.dark};
`

storiesOf('Image', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <Image p={5} src={Logo} />
  })
