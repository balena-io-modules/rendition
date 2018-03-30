
import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import DeleteButton from '../../src/components/DeleteButton'

test('DeleteButton renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <DeleteButton>DeleteButton</DeleteButton>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
