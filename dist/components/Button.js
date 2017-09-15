'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-top: 1px;\n  font-family: inherit;\n  display: inline-block;\n  font-weight: ', ';\n  border-radius: ', ';\n  appearance: none;\n  text-decoration: none;\n  border: 0;\n  margin: 0;\n  min-width: 135px;\n  vertical-align: middle;\n  font-size: inherit;\n  line-height: 1.1;\n  text-align: center;\n  cursor: pointer;\n  background: ', ';\n  color: ', ';\n  border-color: ', ';\n  border: ', ';\n  height: ', ';\n\n  &:hover,\n  &:focus,\n  &:active {\n    color: ', ';\n    background-color: ', ';\n    border: ', ';\n  }\n\n  \'&:disabled\': {\n    opacity: 1/4;\n  }\n\n  svg {\n    transform: translateY(-2px);\n  }\n'], ['\n  padding-top: 1px;\n  font-family: inherit;\n  display: inline-block;\n  font-weight: ', ';\n  border-radius: ', ';\n  appearance: none;\n  text-decoration: none;\n  border: 0;\n  margin: 0;\n  min-width: 135px;\n  vertical-align: middle;\n  font-size: inherit;\n  line-height: 1.1;\n  text-align: center;\n  cursor: pointer;\n  background: ', ';\n  color: ', ';\n  border-color: ', ';\n  border: ', ';\n  height: ', ';\n\n  &:hover,\n  &:focus,\n  &:active {\n    color: ', ';\n    background-color: ', ';\n    border: ', ';\n  }\n\n  \'&:disabled\': {\n    opacity: 1/4;\n  }\n\n  svg {\n    transform: translateY(-2px);\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _utils = require('../utils');

var _recompose = require('recompose');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Base = _styledComponents2.default.button(_templateObject, function (props) {
  return (0, _utils.bold)(props);
}, function (props) {
  return (0, _utils.px)(props.theme.radius);
}, function (props) {
  return props.bg;
}, function (props) {
  return props.color;
}, function (props) {
  return props.borderColor || props.color;
}, function (props) {
  return props.border;
}, function (props) {
  return (0, _utils.px)(props.emphasized ? props.theme.space[5] : props.theme.space[4]);
}, function (props) {
  return props.active.color;
}, function (props) {
  return props.active.bg;
}, function (props) {
  return props.active.border;
});

var emphasized = (0, _recompose.withProps)(function (props) {
  if (props.emphasized) {
    return {
      px: 5
    };
  }
});

var setDefaultProps = (0, _recompose.withProps)(function (props) {
  // set defaults
  // always allow override with provided props
  var color = props.color || props.theme.colors.text.main;
  return Object.assign({
    bg: 'transparent',
    color: color,
    px: 16,
    pb: 0,
    border: '1px solid',
    borderColor: (0, _utils.lighten)(color),
    active: {
      color: '#fff',
      bg: color
    }
  }, props);
});

var getType = (0, _recompose.withProps)(function (props) {
  // get primary, tertiary, secondary and set as props.type
  var type = Object.keys(props).find(function (b) {
    return Object.keys(props.theme.colors).find(function (k) {
      return k === b;
    });
  });
  props.type = type;
  return props;
});

var setTypeProps = (0, _recompose.withProps)(function (_ref) {
  var type = _ref.type,
      theme = _ref.theme;

  // set type colors
  if (!type) return;

  return {
    color: '#fff',
    bg: (0, _get2.default)(theme.colors[type], 'main'),
    active: {
      color: '#fff',
      bg: (0, _get2.default)(theme.colors[type], 'dark')
    }
  };
});

var outline = (0, _recompose.withProps)(function (_ref2) {
  var outline = _ref2.outline,
      color = _ref2.color,
      bg = _ref2.bg,
      border = _ref2.border,
      active = _ref2.active;

  // get primary, tertiary, secondary and set as props.type
  if (!outline) return;

  return {
    bg: color,
    color: bg !== 'transparent' ? bg : '#fff',
    border: border || '1px solid',
    active: {
      color: active.bg,
      bg: active.color
    }
  };
});

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, setDefaultProps, getType, setTypeProps, emphasized, outline, _hoc2.default)(Base);