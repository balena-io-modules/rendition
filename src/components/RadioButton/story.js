import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Box, RadioButton } from '../../'
import Readme from './README.md'

storiesOf('Next/RadioButton', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    const [checked, setChecked] = React.useState('case-2')
    return (
      <Box m={3}>
        <RadioButton
          m={2}
          checked={checked === 'case-1'}
          label='Unchecked radio'
          onChange={() => setChecked('case-1')}
        />
        <RadioButton
          m={2}
          checked={checked === 'case-2'}
          label='Checked radio'
          onChange={() => setChecked('case-2')}
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
    )
  })
