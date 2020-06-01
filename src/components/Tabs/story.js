import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Tab, Tabs, Txt, Box } from '../../'
import Readme from './README.md'

storiesOf('Next/Tabs', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
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
    )
  })
  .add('Long tab names', () => {
    return (
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
    )
  })
  .add('Compact', () => {
    return (
      <Box maxWidth={400}>
        <Tabs p={3} compact>
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
      </Box>
    )
  })
