/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import forEach from 'lodash/forEach'
import { Provider } from '../../../dist'
import JsonSchemaRenderer from '../../../dist/extra/JsonSchemaRenderer'
import examples, { CONTEXT_FUNCTIONS } from './examples'

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
            extraContext={{
              ...CONTEXT_FUNCTIONS,
              root: example.value
            }}
          />
        </Provider>
      )

      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
