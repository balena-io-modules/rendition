
import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Select from '../../src/components/Select'

test('Select renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Select>Select</Select>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
