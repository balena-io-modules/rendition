import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Table from '../../src/components/Table'

test('Table renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Table />
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
