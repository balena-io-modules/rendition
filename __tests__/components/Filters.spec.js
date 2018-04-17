/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Filters from '../../src/components/Filters'

const schema = {
  type: 'object',
  properties: {
    Name: {
      title: 'Pokemon Name',
      type: 'string'
    }
  }
}

test('Filters render correctly', () => {
  const component = renderer.create(
    <Provider>
      <Filters schema={schema} />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
