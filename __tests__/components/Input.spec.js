/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Input from '../../src/components/Input'

test('Input renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Input placeholder='Placeholder Text' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
