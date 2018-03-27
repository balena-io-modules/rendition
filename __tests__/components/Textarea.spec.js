/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Textarea from '../../src/components/Textarea'

test('Textarea renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Textarea>Textarea</Textarea>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
