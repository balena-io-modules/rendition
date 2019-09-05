import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Flex, Provider, RadioButtonGroup } from '../../'
import Readme from './README.md'

storiesOf('Next/RadioButtonGroup', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Flex m={3} flexDirection='row'>
          <RadioButtonGroup
            m={3}
            options={['plain 1', 'plain 2']}
            onChange={action('case-1')}
          />
          <RadioButtonGroup
            m={3}
            options={['plain 1', 'plain 2']}
            value='plain 1'
            onChange={action('case-1')}
          />
          <RadioButtonGroup
            m={3}
            options={[
              { disabled: true, value: 'disabled', label: 'disabled' },
              { disabled: false, value: 'enabled', label: 'enabled' },
              { disabled: false, value: 'selected', label: 'selected' }
            ]}
            value='selected'
            onChange={action('case-2')}
          />
        </Flex>
      </Provider>
    )
  })
