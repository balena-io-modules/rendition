import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import ProgressBar from '../../src/components/ProgressBar'

test('ProgressBar renders correctly', () => {
  const value = 50;
  const component = renderer.create(
    <Provider>
      <ProgressBar value={value}>
        {value}%
      </ProgressBar>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
