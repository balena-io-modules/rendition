import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { DeleteButton } from '../../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Deprecated/DeleteButton', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Standard', () => {
    return <DeleteButton onClick={action('DeleteButton clicked')} />
  })
