/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import forEach from 'lodash/forEach'
import { Provider } from '../../../dist'
import JsonSchemaRenderer from '../../../dist/extra/JsonSchemaRenderer'
import examples from './examples'

const EXTRA_FORMATS = [
  {
    name: 'markdown',
    format: '.*'
  }
]

describe.only('JsonSchemaRenderer component', () => {
  forEach(examples, (example, label) => {
    it(label, () => {
      const component = renderer.create(
        <Provider>
          <JsonSchemaRenderer
            validate
            {...example}
            extraFormats={EXTRA_FORMATS}
          />
        </Provider>
      )

      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
