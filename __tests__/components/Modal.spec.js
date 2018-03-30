import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Modal from '../../src/components/Modal'

test('Modal renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Modal>Modal</Modal>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
