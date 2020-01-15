import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Link, List, Txt } from '../../'
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
  .add('Unordered List', () => {
    return <StoryList />
  })
  .add('Ordered List', () => {
    return <StoryList ordered />
  })
