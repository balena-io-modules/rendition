/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, RadioButton } from '../../../dist'

test('RadioButton renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <RadioButton checked label='Radio Button' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
