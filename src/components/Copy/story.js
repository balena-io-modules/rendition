import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Copy, Flex, Provider, Tag, Table, Txt } from '../../'
import Readme from './README.md'

const columns = [{ field: 'Name' }, { field: 'Value' }]
const data = [
  { Name: 'Type', Value: 'Beginner' },
  { Name: 'Type', Value: 'Advanced' }
]

storiesOf('Next/Copy', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Copy content='Plain text'>
            <Txt>Hover me and click on icon to copy</Txt>
          </Copy>
        </Box>

        <Flex m={3}>
          <Copy content='Beginner' alignItems='center' mr={3}>
            <Tag name='Type' value='Beginner' />
          </Copy>
          <Copy content='Advanced' alignItems='center'>
            <Tag name='Type' value='Advanced' />
          </Copy>
        </Flex>

        <Box m={3}>
          <Copy show='always' content={JSON.stringify(data)}>
            <Table columns={columns} data={data} />
          </Copy>
        </Box>

        <Box m={3}>
          Only copy icon that can be placed anywhere.
          <Copy content={'Hi there'} />
        </Box>
      </Provider>
    )
  })
