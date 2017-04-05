// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

import { configure, setAddon } from '@kadira/storybook';
import React from 'react';
import infoAddon from '@kadira/react-storybook-addon-info';

setAddon(infoAddon);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
