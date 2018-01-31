import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Txt from '../../src/components/Txt'

test('Txt renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Txt>Hello world</Txt>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
