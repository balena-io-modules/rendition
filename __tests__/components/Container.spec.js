
import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import Container from '../../src/components/Container'

test('Container renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Container>Container</Container>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
