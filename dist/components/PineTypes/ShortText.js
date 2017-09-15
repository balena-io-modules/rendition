'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = exports.Edit = exports.validate = exports.rules = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _regexParser = require('regex-parser');

var _regexParser2 = _interopRequireDefault(_regexParser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preact = require('preact');

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

var _showdown = require('showdown');

var _showdown2 = _interopRequireDefault(_showdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var converter = new _showdown2.default.Converter();

var rules = exports.rules = {
  is: function is() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments[1];
    return target === value;
  },
  contains: function contains() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments[1];
    return target.includes(value);
  },
  'does not contain': function doesNotContain() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments[1];
    return !target.includes(value);
  },
  'matches RegEx': function matchesRegEx() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments[1];
    return target.match((0, _regexParser2.default)(value));
  },
  'does not match RegEx': function doesNotMatchRegEx() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments[1];
    return !target.match((0, _regexParser2.default)(value));
  }
};

var validate = exports.validate = function validate(val) {
  return _lodash2.default.isString(val) && val.length <= 255;
};

var Edit = function Edit(_ref) {
  var _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['onChange']);

  return (0, _preact.h)(_Input2.default, _extends({ type: 'text', onChange: function onChange(e) {
      return _onChange(e.target.value);
    } }, props));
};

exports.Edit = Edit;
var Display = function Display(_ref2) {
  var data = _ref2.data,
      props = _objectWithoutProperties(_ref2, ['data']);

  return (0, _preact.h)('div', _extends({}, props, {
    className: 'markdown-body',
    dangerouslySetInnerHTML: { __html: converter.makeHtml(data) }
  }));
};
exports.Display = Display;