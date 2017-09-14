'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = exports.Edit = exports.validate = exports.rules = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preact = require('preact');

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var p10 = function p10(val) {
  return parseInt(val, 10);
};

var rules = exports.rules = {
  equals: function equals(target, value) {
    return p10(target) === p10(value);
  },
  'more than': function moreThan(target, value) {
    return p10(target) > p10(value);
  },
  'less than': function lessThan(target, value) {
    return p10(target) < p10(value);
  }
};

var validate = exports.validate = _lodash2.default.isInteger;

var Edit = function Edit(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['value', 'onChange']);

  return (0, _preact.h)(_Input2.default, _extends({}, props, {
    type: 'number',
    value: value,
    onChange: function onChange(e) {
      return _onChange(p10(e.target.value));
    }
  }));
};

exports.Edit = Edit;
var Display = function Display(_ref2) {
  var data = _ref2.data,
      props = _objectWithoutProperties(_ref2, ['data']);

  return (0, _preact.h)(
    'div',
    props,
    (0, _preact.h)(
      'span',
      null,
      p10(data)
    )
  );
};
exports.Display = Display;