import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Text from '../components/Text'
import Heading from '../components/Heading'
import Link from '../components/Link'

const Container = styled.div`margin: 60px;`

storiesOf('Typography', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Headings', () => {
    return (
      <div>
        <Heading.h1>Heading h1</Heading.h1>
        <Heading.h2>Heading h2</Heading.h2>
        <Heading.h3>Heading h3</Heading.h3>
        <Heading.h4>Heading h4</Heading.h4>
        <Heading.h5>Heading h5</Heading.h5>
        <Heading.h6>Heading h6</Heading.h6>
      </div>
    )
  })
  .addWithInfo('Text', props => {
    return (
      <div>
        <Text>Standard text</Text>
        <Text align='center'>Centered</Text>
        <Text align='right'>Right</Text>
        <Text bold>Bold</Text>
        <Text.span color='blue'>Inline </Text.span>
        <Text.span color='red'>Inline </Text.span>
        <Text.span color='yellow'>Inline </Text.span>
      </div>
    )
  })
  .addWithInfo('Link', props => {
    return (
      <div>
        <div>
          <Link href={`#`}>Internal Link</Link>
        </div>
        <div>
          <Link href={`https://resin.io`} blank>
            External Link
          </Link>
        </div>
        <div>
          <Link disabled href={`https://resin.io`} blank>
            Disabled Link
          </Link>
        </div>
      </div>
    )
  })
