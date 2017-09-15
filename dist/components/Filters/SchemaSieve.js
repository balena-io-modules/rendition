'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint class-methods-use-this: 0 */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _PineTypes = require('../PineTypes');

var _PineTypes2 = _interopRequireDefault(_PineTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIMPLE_SEARCH_NAME = 'Full text search';

var SchemaSieve = function () {
  function SchemaSieve() {
    var tests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SchemaSieve);

    this.tests = _lodash2.default.assign(_lodash2.default.cloneDeep(_PineTypes2.default), tests);

    this.SIMPLE_SEARCH_NAME = SIMPLE_SEARCH_NAME;
  }

  _createClass(SchemaSieve, [{
    key: 'baseTest',
    value: function baseTest(item, input) {
      var type = input.type,
          name = input.name;

      // A simple search is not strictly a "type" and searches on all fields,
      // so we handle that seperately here

      if (name === SIMPLE_SEARCH_NAME) {
        var value = input.value;

        return _lodash2.default.some(item, function (target) {
          return target && String(target).toLowerCase().includes(value.toLowerCase());
        });
      }

      if (type in _PineTypes2.default) {
        var operator = input.operator,
            _value = input.value;

        var target = item[name];

        if (operator in _PineTypes2.default[type].rules) {
          return _PineTypes2.default[type].rules[operator](target, _value);
        }

        throw new Error(operator + ' is not a valid operator for ' + type + ' types');
      }
      throw new Error('There is no filter test for type ' + type);
    }
  }, {
    key: 'filter',
    value: function filter(collection, input) {
      if (_lodash2.default.isObject(collection)) {
        return this.filterObject(collection, input);
      }
      if (_lodash2.default.isArray(collection)) {
        return this.filterArray(collection, input);
      }

      throw new Error('collection argument must be either object or array.');
    }
  }, {
    key: 'filterArray',
    value: function filterArray(collection, input) {
      var _this = this;

      return collection.filter(function (item) {
        return _this.baseTest(item, input);
      });
    }
  }, {
    key: 'filterObject',
    value: function filterObject(collection, input) {
      var _this2 = this;

      return _lodash2.default.pickBy(collection, function (value) {
        return _this2.baseTest(value, input);
      });
    }
  }, {
    key: 'getOperators',
    value: function getOperators(type) {
      if (type in _PineTypes2.default) {
        return Object.keys(_PineTypes2.default[type].rules);
      }
      return [];
    }
  }, {
    key: 'makeFilterInputs',
    value: function makeFilterInputs(schema) {
      var _this3 = this;

      var inputs = {};

      _lodash2.default.forEach(schema, function (value, key) {
        inputs[key] = {
          type: value.type,
          name: key,
          availableOperators: _this3.getOperators(value.type),
          operator: null,
          value: null
        };
      });

      return inputs;
    }
  }, {
    key: 'validate',
    value: function validate(type, value) {
      // If the type is unknown just return true
      if (!(type in _PineTypes2.default)) {
        return true;
      }

      return _PineTypes2.default[type].validate(value);
    }
  }, {
    key: 'getTypes',
    value: function getTypes() {
      return Object.keys(_PineTypes2.default);
    }
  }]);

  return SchemaSieve;
}();

exports.default = function (tests) {
  return new SchemaSieve(tests);
};