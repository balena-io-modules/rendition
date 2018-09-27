/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Toggle from '../../src/components/Toggle'

test('ToggleButton renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Toggle />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
