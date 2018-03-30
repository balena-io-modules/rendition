import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import { Flex } from '../../src/components/Grid'

test('Flex renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Flex>Flex</Flex>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
