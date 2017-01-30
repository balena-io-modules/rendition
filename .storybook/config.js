// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

import { configure, addDecorator, setAddon } from '@kadira/storybook';
import React from 'react';
import infoAddon from '@kadira/react-storybook-addon-info';

// Theme
import { ThemeProvider } from 'styled-components';
import theme from '../src/styles/theme';

setAddon(infoAddon);

addDecorator(story => (
  <ThemeProvider theme={theme}>
    {story()}
  </ThemeProvider>
))

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
