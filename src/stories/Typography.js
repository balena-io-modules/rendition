import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Heading, Link, Provider, Txt } from '../'
import * as headingReadme from './README/Heading.md'
import * as txtReadme from './README/Txt.md'
import * as linkReadme from './README/Link.md'

storiesOf('Core/Typography', module)
  .add(
    'Headings',
    withReadme(headingReadme, () => {
      return (
        <Provider>
          <Box m={3}>
            <Heading.h1>Heading h1</Heading.h1>
            <Heading.h2>Heading h2</Heading.h2>
            <Heading.h3>Heading h3</Heading.h3>
            <Heading.h4>Heading h4</Heading.h4>
            <Heading.h5>Heading h5</Heading.h5>
            <Heading.h6>Heading h6</Heading.h6>
          </Box>
        </Provider>
      )
    })
  )
  .add(
    'Txt',
    withReadme(txtReadme, () => {
      return (
        <Provider>
          <Box m={3}>
            <Txt>Standard txt</Txt>
            <Txt align='center'>Centered</Txt>
            <Txt align='right'>Right</Txt>
            <Txt bold>Bold</Txt>
            <Txt monospace>Monospace</Txt>
            <Txt.span color='blue'>Inline </Txt.span>
            <Txt.span color='red'>Inline </Txt.span>
            <Txt.span color='yellow'>Inline </Txt.span>
          </Box>
        </Provider>
      )
    })
  )
  .add(
    'Link',
    withReadme(linkReadme, () => {
      return (
        <Provider>
          <Box m={3}>
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
          </Box>
        </Provider>
      )
    })
  )
