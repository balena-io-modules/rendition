/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, RadioButtonGroup } from '../../../dist'

test('RadioButtonGroup renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <RadioButtonGroup
        value='selected'
        options={[
          { disabled: true, value: 'disabled', label: 'disabled' },
          { disabled: false, value: 'enabled', label: 'enabled' },
          { disabled: false, value: 'selected', label: 'selected' }
        ]}
      />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
