import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Flex, RadioButtonGroup } from '../../'
import Readme from './README.md'

storiesOf('Next/RadioButtonGroup', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    const [selected, setSelected] = React.useState('plain 1')
    return (
      <Flex m={3} flexDirection='row'>
        <RadioButtonGroup
          m={3}
          options={['plain 1', 'plain 2']}
          value={selected}
          onChange={e => setSelected(e.target.value)}
        />
        <RadioButtonGroup
          m={3}
          options={['plain 1', 'plain 2']}
          value={selected}
          onChange={e => setSelected(e.target.value)}
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
    )
  })
