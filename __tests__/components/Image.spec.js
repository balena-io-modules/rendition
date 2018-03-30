
import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Image from '../../src/components/Image'

test('Image renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Image>Image</Image>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
