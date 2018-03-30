import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Select from '../../src/components/Select'

test('Select renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Select>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={3}>Option 3</option>
      </Select>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
