/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Heading from '../../src/components/Heading'

test('Heading renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Heading>Heading</Heading>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
