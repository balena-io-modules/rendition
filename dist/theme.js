'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monospace = exports.font = exports.radius = exports.weights = exports.fontSizes = exports.space = exports.breakpoints = undefined;

var _utils = require('./utils');

var primary = '#2297DE';
var secondary = '#FFC523';
var tertiary = '#4D5057';
var quartenary = '#EBEFF4';

var danger = '#FF423D';
var warning = '#FCA321';
var success = '#76C950';
var info = '#1496E1';

var colors = {
  primary: {
    main: primary,
    light: (0, _utils.lighten)(primary),
    dark: (0, _utils.darken)(primary)
  },
  secondary: {
    main: secondary,
    light: (0, _utils.lighten)(secondary),
    dark: (0, _utils.darken)(secondary)
  },
  tertiary: {
    main: tertiary,
    light: (0, _utils.lighten)(tertiary),
    dark: (0, _utils.darken)(tertiary)
  },
  quartenary: {
    main: quartenary,
    light: (0, _utils.lighten)(quartenary),
    // Can't quite replicate this programatically :(
    dark: '#d3d7dc'
  },

  danger: {
    main: danger,
    light: (0, _utils.fade)(danger),
    dark: (0, _utils.blacken)(danger)
  },
  warning: {
    main: warning,
    light: (0, _utils.fade)(warning),
    dark: (0, _utils.blacken)(warning)
  },
  success: {
    main: success,
    light: (0, _utils.fade)(success),
    dark: (0, _utils.blacken)(success)
  },
  info: {
    main: info,
    light: (0, _utils.fade)(info),
    dark: (0, _utils.blacken)(info)
  },

  text: {
    main: '#3c3e42',
    light: '#8f9297'
  },

  statusIdle: {
    main: '#89c683'
  },
  statusConfiguring: {
    main: '#ffb25e'
  },
  statusUpdating: {
    main: '#7ccdfd'
  },
  statusPostProvisioning: {
    main: '#aa96d5'
  },
  statusOffline: {
    main: '#fd7c7c'
  },

  gray: {
    light: '#f4f4f4',
    main: '#c6c8c9',
    dark: '#9f9f9f'
  }
};

var defaultControlHeight = 36;
var emphasizedControlHeight = 45;

var breakpoints = exports.breakpoints = [32, 48, 64, 80];

var space = exports.space = [0, 4, 8, 16, defaultControlHeight, emphasizedControlHeight, 128];

var fontSizes = exports.fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 72, 96];

var weights = exports.weights = [400, 700];

var radius = exports.radius = 4;
var font = exports.font = 'Roboto, Arial, sans-serif';
var monospace = exports.monospace = '\'Ubuntu Mono Web\', \'Courier New\', monospace';

exports.default = {
  breakpoints: breakpoints,
  space: space,
  fontSizes: fontSizes,
  weights: weights,
  font: font,
  monospace: monospace,
  colors: colors,
  radius: radius
};