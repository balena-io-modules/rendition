import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Text from '../../src/components/Text'

test('Text renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Text>Text</Text>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
