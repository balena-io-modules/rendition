/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from '../../../dist'
import { Markdown } from '../../../dist/extra/Markdown'
import suite from './specsuite'

export const codeBlocks = `
## Code blocks

\`\`\`
// This is plaintext
const foo = () => {
  return 'bar'
}
\`\`\`

\`\`\`javascript
// This is javascript
const foo = () => {
  return 'bar'
}
\`\`\`
`

export const htmlBlocks = `

## Inline HTML

<strong>An image:</strong>
<br>
<img src="https://balena.io" />
<br>
<em>A link:</em>
<a target="_blank" href="http://github.com/">http://github.com/</a>

## Keyboard keys

<kbd>cmd</kbd> + <kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>a</kbd>
`

export const sanitizeBlocks = `
<img src=x onerror=alert(123) />
`

describe('Markdown component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Markdown>Hello world</Markdown>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should not highlight code when disabled', () => {
    const component = renderer.create(
      <Provider>
        <Markdown disableCodeHighlight>{codeBlocks}</Markdown>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should not sanitize html when disabled', () => {
    const component = renderer.create(
      <Provider>
        <Markdown sanitizerOptions={null}>{sanitizeBlocks}</Markdown>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should not render raw html when disabled', () => {
    const component = renderer.create(
      <Provider>
        <Markdown disableRawHtml>{htmlBlocks}</Markdown>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  suite.forEach((testCase) => {
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
        .children('div')
        .children()
        .html()
        .trim()

      expect(result).toMatchSnapshot()
    })
  })
})
