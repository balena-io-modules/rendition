'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: fixed;\n  top: ', ';\n  right: ', ';\n  bottom: ', ';\n  left: ', ';\n  z-index: ', ';\n  background: ', ';\n'], ['\n  position: fixed;\n  top: ', ';\n  right: ', ';\n  bottom: ', ';\n  left: ', ';\n  z-index: ', ';\n  background: ', ';\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _recompose = require('recompose');

var _defaultTo = require('lodash/defaultTo');

var _defaultTo2 = _interopRequireDefault(_defaultTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Base = _styledComponents2.default.div(_templateObject, function (props) {
  return (0, _defaultTo2.default)(props.top, 0);
}, function (props) {
  return (0, _defaultTo2.default)(props.right, 0);
}, function (props) {
  return (0, _defaultTo2.default)(props.bottom, 0);
}, function (props) {
  return (0, _defaultTo2.default)(props.left, 0);
}, function (props) {
  return (0, _defaultTo2.default)(props.z, 0);
}, function (props) {
  return (0, _defaultTo2.default)(props.bg, 'none');
});

var dimensions = (0, _recompose.withProps)(function (props) {
  return {
    top: props.top === true ? 0 : props.top,
    right: props.right === true ? 0 : props.right,
    bottom: props.bottom === true ? 0 : props.bottom,
    left: props.left === true ? 0 : props.left
  };
});

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, dimensions, _hoc2.default)(Base);