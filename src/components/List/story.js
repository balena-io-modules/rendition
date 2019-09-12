import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Link, List, Provider, Txt } from '../../'
import Readme from './README.md'

const StoryList = ({ ordered }) => {
  return (
    <List m={3} ordered={ordered}>
      <Txt>
        You can put <Link href={action('link clicked')}>a link</Link>
      </Txt>
      <Txt>
        And also some <code>code</code>
      </Txt>
      <Txt>
        Multiline text
        <Txt>that breaks into multiple lines</Txt>
      </Txt>
    </List>
  )
}

storiesOf('Next/List', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Unordered List', () => {
    return (
      <Provider>
        <StoryList />
      </Provider>
    )
  })
  .add('Ordered List', () => {
    return (
      <Provider>
        <StoryList ordered />
      </Provider>
    )
  })
