'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomString = exports.px = exports.bold = exports.blacken = exports.fade = exports.darken = exports.lighten = undefined;

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lighten = exports.lighten = function lighten(color) {
  return (0, _color2.default)(color).fade(0.3).string();
};

var darken = exports.darken = function darken(color) {
  return (0, _color2.default)(color).darken(0.2).string();
};

var fade = exports.fade = function fade(color) {
  return (0, _color2.default)(color).fade(0.95).string();
};

var blacken = exports.blacken = function blacken(color) {
  return (0, _color2.default)(color).darken(0.6).string();
};

var bold = exports.bold = function bold(props) {
  return (0, _get2.default)(props.theme, 'weights.1');
};

var px = exports.px = function px(n) {
  return typeof n === 'number' ? n + 'px' : n;
};

var randomString = exports.randomString = function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};