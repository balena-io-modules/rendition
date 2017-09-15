'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = exports.Edit = exports.validate = exports.rules = exports.startOfDay = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _preact = require('preact');

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
  Date compares the day as the lowest level of granularity.
  Date types use momentjs for comparison, so the input and target value
  should be in one of the following forms:
  - ISO 8601
  - Unix timestamp (seconds or milliseconds)
  - JS Date object
  See https://momentjs.com/docs/#/parsing/ for more information
*/
var startOfDay = exports.startOfDay = function startOfDay(val) {
  return (0, _moment2.default)(val).startOf('day');
};

var rules = exports.rules = {
  is: function is(target, value) {
    return target && startOfDay(target).isSame(startOfDay(value));
  },
  'is before': function isBefore(target, value) {
    return target && startOfDay(target).isBefore(startOfDay(value));
  },
  'is after': function isAfter(target, value) {
    return target && startOfDay(target).isAfter(startOfDay(value));
  }
};

var validate = exports.validate = function validate(value) {
  return (0, _moment2.default)(value).isValid();
};

var Edit = function Edit(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['value', 'onChange']);

  return (0, _preact.h)(_Input2.default, _extends({}, props, {
    type: 'date',
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    }
  }));
};

exports.Edit = Edit;
var Display = function Display(_ref2) {
  var data = _ref2.data,
      _ref2$dateFormat = _ref2.dateFormat,
      dateFormat = _ref2$dateFormat === undefined ? 'dddd, MMMM Do YYYY' : _ref2$dateFormat,
      props = _objectWithoutProperties(_ref2, ['data', 'dateFormat']);

  return (0, _preact.h)(
    'div',
    props,
    (0, _preact.h)(
      'span',
      null,
      (0, _moment2.default)(data).format(dateFormat)
    )
  );
};
exports.Display = Display;