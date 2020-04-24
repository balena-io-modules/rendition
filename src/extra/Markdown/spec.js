/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from '../../../dist'
import { Markdown } from '../../../dist/extra/Markdown'
import suite from './specsuite'

describe.only('Markdown component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Markdown>Hello world</Markdown>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  suite.forEach(testCase => {
    it(testCase.name, () => {
      const wrapper = mount(
        <Provider>
          <Markdown sanitizerOptions={testCase.sanitizerOptions}>
            {testCase.source}
          </Markdown>
        </Provider>
      )

      // Unwrap the provider and markdown wrapper to get the HTML inside
      const result = wrapper
        .childAt(0)
        .render()
        .children()
        .html()
        .trim()

      expect(result).toEqual(testCase.expected)
    })
  })
})
