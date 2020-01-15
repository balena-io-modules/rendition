import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Tag, Box } from '../../'
import Readme from './README.md'

storiesOf('Next/Tag', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Tag m={2} name='Tag1' value='value1' />
        <Tag m={2} name='Tag2' operator='has' value='operator' />
        <Tag m={2} value='only value' />
        <Tag m={2} name='only name' />
        <Tag m={2} />
      </Box>
    )
  })
  .add('Multiple values in a tag', () => {
    return (
      <Box m={3}>
        <Tag
          m={2}
          multiple={[
            { name: 'Tag1', operator: 'contains', value: 'value1' },
            {
              prefix: 'or',
              name: 'Tag2',
              operator: 'contains',
              value: 'value2'
            }
          ]}
        />
        <Tag
          m={2}
          multiple={[
            { name: 'Tag3', operator: 'contains', value: 'value3' },
            {
              prefix: 'and',
              name: 'Tag4',
              operator: 'contains',
              value: 'value4'
            }
          ]}
        />
      </Box>
    )
  })
  .add('Actionable', () => {
    return (
      <Box m={3}>
        <Tag
          m={2}
          name='Closable'
          value='tag'
          onClose={action('close called')}
        />
        <Tag
          m={2}
          name='Clickable'
          value='tag'
          onClick={action('click called')}
        />
        <Tag
          m={2}
          name='Clickable'
          operator='and'
          value='closable'
          onClose={action('close called')}
          onClick={action('click called')}
        />
      </Box>
    )
  })
