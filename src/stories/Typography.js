import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Heading, Link, Txt } from '../'

const Container = styled.div`
  margin: 60px;
`

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
  .addWithInfo('Txt', props => {
    return (
      <div>
        <Txt>Standard txt</Txt>
        <Txt align='center'>Centered</Txt>
        <Txt align='right'>Right</Txt>
        <Txt bold>Bold</Txt>
        <Txt monospace>Monospace</Txt>
        <Txt.span color='blue'>Inline </Txt.span>
        <Txt.span color='red'>Inline </Txt.span>
        <Txt.span color='yellow'>Inline </Txt.span>
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
