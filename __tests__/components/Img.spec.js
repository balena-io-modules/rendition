import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Img from '../../src/components/Img'

test('Img renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Img />
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
