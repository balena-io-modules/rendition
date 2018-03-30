import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Link from '../../src/components/Link'

test('Link renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Link>Link</Link>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
