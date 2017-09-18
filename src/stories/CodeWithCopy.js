import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import CodeWithCopy from '../components/CodeWithCopy'

const Container = styled.div`margin: 30px;`

storiesOf('CodeWithCopy', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <CodeWithCopy
        text='click me'
        copy='This value has been copied to your clipboard!'
      />
    )
  })
