import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Box } from '../'
import * as Readme from './README/Box.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/Box', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box bg='#909090' p={3} color='white'>
        <p>I'm in a Box!</p>
      </Box>
    )
  })
