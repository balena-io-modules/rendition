const fs = require('fs');

const testFolder = './__tests__/components/'

const components = [
  'Alert',
  'Badge',
  'BadgeSelect',
  'Banner',
  'Box',
  'Button',
  'CodeWithCopy',
  'Container',
  'DeleteButton',
  'DeviceStatusGauge',
  'Divider',
  'DropDownButton',
  'Filters',
  'Fixed',
  'Flex',
  'Gauge',
  'Heading',
  'Link',
  'Input',
  'Image',
  'Modal',
  'Navbar',
  'ProgressBar',
  'Select',
  'Table',
  'Text',
  'Textarea',
  'Terminal',
]

const fileText = (component) => `
import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../../src/components/Provider'
import ${component} from '../../src/components/${component}'

test('${component} renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <${component}>${component}</${component}>
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
`

const files = fs.readdirSync(testFolder)

components.forEach(component => {
  const n =`${component}.spec.js`
  if (files.indexOf(n) === -1) {
    fs.writeFile(testFolder + n, fileText(component), 'utf8');
  }
})
