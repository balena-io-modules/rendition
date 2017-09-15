'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  border-radius: ', ';\n  height: ', ';\n  font-size: inherit;\n  border: 1px solid ', ';\n  padding-top: 0px;\n  padding-bottom: 0px;\n  padding-left: 16px;\n  padding-right: ', ';\n  background-color: white;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  width: 100%;\n\n  &:hover {\n    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);\n  }\n'], ['\n  border-radius: ', ';\n  height: ', ';\n  font-size: inherit;\n  border: 1px solid ', ';\n  padding-top: 0px;\n  padding-bottom: 0px;\n  padding-left: 16px;\n  padding-right: ', ';\n  background-color: white;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  width: 100%;\n\n  &:hover {\n    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: inline-block;\n  position: relative;\n\n  &::after {\n    content: \'\';\n    width: 0;\n    height: 0;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n    border-top: 5px solid ', ';\n\n    position: absolute;\n    right: 16px;\n    top: ', ';\n  }\n'], ['\n  display: inline-block;\n  position: relative;\n\n  &::after {\n    content: \'\';\n    width: 0;\n    height: 0;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n    border-top: 5px solid ', ';\n\n    position: absolute;\n    right: 16px;\n    top: ', ';\n  }\n']);

var _preact = require('preact');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _utils = require('../utils');

var _theme = require('../theme');

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Base = _styledComponents2.default.select(_templateObject, (0, _utils.px)(_theme.radius), function (props) {
  return (0, _utils.px)(props.emphasized ? props.theme.space[5] : props.theme.space[4]);
}, function (props) {
  return props.theme.colors.gray.main;
}, function (props) {
  return (0, _utils.px)(props.emphasized ? props.theme.space[5] : props.theme.space[4]);
});

var Wrapper = _styledComponents2.default.span(_templateObject2, function (props) {
  return props.theme.colors.gray.dark;
}, function (props) {
  return (0, _utils.px)(props.emphasized ? 20 : 16);
});

var Component = function Component(_ref) {
  var emphasized = _ref.emphasized,
      children = _ref.children,
      value = _ref.value,
      onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['emphasized', 'children', 'value', 'onChange']);

  return (0, _preact.h)(
    Wrapper,
    _extends({ emphasized: emphasized }, props),
    (0, _preact.h)(Base, {
      emphasized: emphasized,
      value: value,
      onChange: onChange,
      children: children
    })
  );
};

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, _hoc2.default)(Component);