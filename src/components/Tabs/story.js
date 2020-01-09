import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Provider, Tab, Tabs, Txt } from '../../'
import Readme from './README.md'

storiesOf('Next/Tabs', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Tabs p={3}>
          <Tab title='Tab 1'>
            <Txt mt={3}>Here is tab #1</Txt>
          </Tab>
          <Tab title='Tab 2'>
            <Txt mt={3}>Here is tab #2</Txt>
          </Tab>
          <Tab title='Tab 3'>
            <Txt mt={3}>Here is tab #3</Txt>
          </Tab>
        </Tabs>
      </Provider>
    )
  })
  .add('Long tab names', () => {
    return (
      <Provider>
        <Tabs p={3}>
          <Tab title='This is a very long tab name'>
            <Txt mt={3}>Here is tab #1</Txt>
          </Tab>
          <Tab title='This is another very long tab name'>
            <Txt mt={3}>Here is tab #2</Txt>
          </Tab>
          <Tab title='And this is a third very long tab name'>
            <Txt mt={3}>Here is tab #3</Txt>
          </Tab>
        </Tabs>
      </Provider>
    )
  })
