/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Accordion, Provider } from '../../../dist'

test('Accordion renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Accordion
        items={[
          { label: 'Heading one', panel: 'First Panel' },
          { label: 'Second Heading', panel: 'Second Panel' }
        ]}
      />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
