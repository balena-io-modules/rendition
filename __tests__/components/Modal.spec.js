/* globals expect, test */
import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import {
  Modal,
  Provider
} from '../../src'

// react-test-renderer does not play nicely with ReactDOM.createPortal(), which
// is used by Grommet's Layer component in the Modal component. To get it to
// work without throwing an error, the ReactDOM.createPortal() method is stubbed
// here.
// see: https://github.com/facebook/react/issues/11565
ReactDOM.createPortal = node => node

test('Modal renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Modal>Modal</Modal>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
