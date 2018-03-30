import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import BadgeSelect from '../../src/components/BadgeSelect'

test('BadgeSelect renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
      />
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
