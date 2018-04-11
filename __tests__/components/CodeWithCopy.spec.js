/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import CodeWithCopy from '../../src/components/CodeWithCopy'

test('CodeWithCopy renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <CodeWithCopy
        text='22ab7io'
        copy='This value has been copied to your clipboard!'
      />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
