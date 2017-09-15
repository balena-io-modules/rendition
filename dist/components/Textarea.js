'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  border-radius: ', ';\n  font-size: inherit;\n  border: 1px solid ', ';\n  padding: 8px 16px;\n  resize: vertical;\n  display: block;\n  width: 100%;\n\n  &:hover {\n    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);\n  }\n  &::placeholder {\n    color: ', ';\n  }\n'], ['\n  border-radius: ', ';\n  font-size: inherit;\n  border: 1px solid ', ';\n  padding: 8px 16px;\n  resize: vertical;\n  display: block;\n  width: 100%;\n\n  &:hover {\n    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);\n  }\n  &::placeholder {\n    color: ', ';\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _utils = require('../utils');

var _theme = require('../theme');

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Base = _styledComponents2.default.textarea(_templateObject, (0, _utils.px)(_theme.radius), function (props) {
  return props.theme.colors.gray.main;
}, function (props) {
  return props.theme.colors.gray.main;
});

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, _hoc2.default)(Base);