'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = exports.Edit = exports.validate = exports.rules = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _resinSemver = require('resin-semver');

var semver = _interopRequireWildcard(_resinSemver);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _preact = require('preact');

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var rules = exports.rules = {
  is: function is(target, value) {
    return target && semver.compare(target, value) === 0;
  },
  'is greater than': function isGreaterThan(target, value) {
    return target && semver.gt(target, value);
  },
  'is less than': function isLessThan(target, value) {
    return target && semver.lt(target, value);
  }
};

var validate = exports.validate = _lodash2.default.isString;

var Edit = function Edit(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ['value', 'onChange']);

  return (0, _preact.h)(_Input2.default, _extends({}, props, {
    type: 'text',
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    }
  }));
};

exports.Edit = Edit;
var Display = function Display(_ref2) {
  var data = _ref2.data,
      props = _objectWithoutProperties(_ref2, ['data']);

  return (0, _preact.h)(
    'div',
    _extends({}, props, { className: 'markdown-body' }),
    (0, _preact.h)(
      'code',
      null,
      data
    )
  );
};
exports.Display = Display;