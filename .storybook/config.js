// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

import { configure, addDecorator } from '@kadira/storybook';
import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: 'red',
    secondary: 'green',
    tertiary: 'blue',
    lightGray: '#ddd'
  }
};

addDecorator(story => (
  <ThemeProvider theme={theme}>
    {story()}
  </ThemeProvider>
))

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
