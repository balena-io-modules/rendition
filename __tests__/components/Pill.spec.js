/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Pill from '../../src/components/Pill'

test('Primary Pill renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Pill primary>pill</Pill>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Small Danger Pill renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Pill danger small>pill</Pill>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
