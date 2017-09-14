'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['color: ', ';'], ['color: ', ';']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Base = _styledComponents2.default.hr(_templateObject, function (props) {
  return props.color || '#333';
});

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, _hoc2.default)(Base);