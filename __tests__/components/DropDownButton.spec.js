/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import DropDownButton from '../../src/components/DropDownButton'

test('DropDownButton renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <DropDownButton primary label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
