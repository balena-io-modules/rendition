import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, RadioButton } from '../../'
import Readme from './README.md'

storiesOf('Next/RadioButton', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <RadioButton
            m={2}
            label='Unchecked radio'
            onChange={action('case-1')}
          />
          <RadioButton
            m={2}
            checked
            label='Checked radio'
            onChange={action('case-2')}
          />
          <RadioButton
            m={2}
            disabled
            label='Disabled radio'
            onChange={action('case-3')}
          />
          <RadioButton
            m={2}
            checked
            disabled
            label='Checked disabled radio'
            onChange={action('case-4')}
          />
        </Box>
      </Provider>
    )
  })
