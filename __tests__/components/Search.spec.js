/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Search from '../../src/components/Search'

test('Search renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Search placeholder='Placeholder Text' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
