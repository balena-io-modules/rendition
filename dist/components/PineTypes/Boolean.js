'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = exports.validate = exports.rules = exports.Edit = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preact = require('preact');

var _Select = require('../Select');

var _Select2 = _interopRequireDefault(_Select);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Edit = function Edit(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['value', 'onChange']);

  return (0, _preact.h)(
    _Select2.default,
    _extends({}, props, {
      value: value ? 'true' : 'false',
      onChange: function onChange(e) {
        return _onChange(e.target.value === 'true');
      }
    }),
    (0, _preact.h)(
      'option',
      null,
      'true'
    ),
    (0, _preact.h)(
      'option',
      null,
      'false'
    )
  );
};

exports.Edit = Edit;
var rules = exports.rules = {
  'is true': function isTrue(target) {
    return !!target;
  },
  'is false': function isFalse(target) {
    return !target;
  }
};

var validate = exports.validate = _lodash2.default.isBoolean;

var Display = function Display(_ref2) {
  var data = _ref2.data,
      props = _objectWithoutProperties(_ref2, ['data']);

  return (0, _preact.h)(
    'div',
    props,
    (0, _preact.h)(
      'span',
      null,
      data ? 'true' : 'false'
    )
  );
};
exports.Display = Display;