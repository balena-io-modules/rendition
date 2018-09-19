import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { BadgeSelect, Box, Provider } from '../'
import * as Readme from './README/BadgeSelect.md'

storiesOf('Core/BadgeSelect', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <BadgeSelect
            placeholder='Select a target'
            items={['wpe', 'web', 'redis']}
            onItemChange={action('onItemChange')}
          />
        </Box>
      </Provider>
    )
  })
  .add('Prefix', () => {
    return (
      <Provider>
        <Box m={3}>
          <BadgeSelect
            placeholder='Select a target'
            items={['wpe', 'web', 'redis']}
            extraPrefix={['Host OS']}
            onItemChange={action('onItemChange')}
          />
        </Box>
      </Provider>
    )
  })
  .add('Suffix', () => {
    return (
      <Provider>
        <Box m={3}>
          <BadgeSelect
            placeholder='Select a target'
            items={['wpe', 'web', 'redis']}
            extraSuffix={['Host OS']}
            onItemChange={action('onItemChange')}
          />
        </Box>
      </Provider>
    )
  })
