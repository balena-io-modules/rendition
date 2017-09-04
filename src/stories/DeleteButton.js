import { h } from 'preact'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import DeleteButton from '../components/DeleteButton'

const Container = styled.div`margin: 30px;`

storiesOf('DeleteButton', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <DeleteButton onPress={action('DeleteButton clicked')} />
  })
