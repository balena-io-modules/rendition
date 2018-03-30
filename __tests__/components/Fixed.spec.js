import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Fixed from '../../src/components/Fixed'

test('Fixed renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Fixed>Fixed</Fixed>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
