'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  margin-top: 15px;\n  padding: 6px 11px 0;\n  border: solid 1px #979797;\n'], ['\n  margin-top: 15px;\n  padding: 6px 11px 0;\n  border: solid 1px #979797;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  border: 0;\n  background: none;\n  padding: 0;\n  font-size: 13px;\n  float: right;\n'], ['\n  border: 0;\n  background: none;\n  padding: 0;\n  font-size: 13px;\n  float: right;\n']);

var _preact = require('preact');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Grid = require('../Grid');

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

var _Text = require('../Text');

var _Text2 = _interopRequireDefault(_Text);

var _Select = require('../Select');

var _Select2 = _interopRequireDefault(_Select);

var _fa = require('react-icons/lib/fa');

var _Modal = require('../Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _FilterDescription = require('./FilterDescription');

var _FilterDescription2 = _interopRequireDefault(_FilterDescription);

var _SchemaSieve = require('./SchemaSieve');

var _SchemaSieve2 = _interopRequireDefault(_SchemaSieve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var sieve = (0, _SchemaSieve2.default)();

var BorderedDiv = _styledComponents2.default.div(_templateObject);

var ActionBtn = _styledComponents2.default.button(_templateObject2);

var FilterSummary = function (_Component) {
  _inherits(FilterSummary, _Component);

  function FilterSummary(props) {
    _classCallCheck(this, FilterSummary);

    var _this = _possibleConstructorReturn(this, (FilterSummary.__proto__ || Object.getPrototypeOf(FilterSummary)).call(this, props));

    _this.state = {
      name: '',
      showForm: false,
      id: '',
      option: 'new',
      scope: 'user'
    };
    return _this;
  }

  _createClass(FilterSummary, [{
    key: 'setExistingId',
    value: function setExistingId(e) {
      var id = e.target.value;
      this.setState({ id: id });
    }
  }, {
    key: 'setViewScope',
    value: function setViewScope(scope) {
      this.setState({ scope: scope });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      var name = e.target.value;
      this.setState({ name: name });
    }
  }, {
    key: 'save',
    value: function save() {
      var _state = this.state,
          name = _state.name,
          id = _state.id,
          scope = _state.scope;


      if (!name && !id) {
        return;
      }

      this.props.saveView(name, scope);

      this.setState({
        name: '',
        showForm: false,
        id: ''
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        BorderedDiv,
        null,
        (0, _preact.h)(
          ActionBtn,
          {
            onClick: function onClick() {
              return _this2.setState({ showForm: !_this2.state.showForm });
            }
          },
          (0, _preact.h)(_fa.FaBookmarkO, { style: { marginRight: 6 } }),
          'Save view'
        ),
        (0, _preact.h)(
          _Text2.default,
          { fontSize: 13, mb: 10 },
          'Filters (',
          this.props.rules.length,
          ')'
        ),
        this.state.showForm && (0, _preact.h)(
          _Modal2.default,
          {
            title: 'Save current view',
            cancel: function cancel() {
              return _this2.setState({ showForm: false });
            },
            done: function done() {
              return _this2.save();
            },
            action: 'Save'
          },
          (0, _preact.h)(
            _Grid.Flex,
            { mb: 30 },
            (0, _preact.h)(
              _Text2.default,
              { width: 90 },
              'Visible to:'
            ),
            (0, _preact.h)(
              _Select2.default,
              {
                mt: 10,
                width: 120,
                value: this.state.scope,
                onChange: function onChange(e) {
                  return _this2.setViewScope(e.target.value);
                }
              },
              (0, _preact.h)(
                'option',
                { value: 'user' },
                'just me'
              ),
              (0, _preact.h)(
                'option',
                { value: 'global' },
                'everyone'
              )
            )
          ),
          (0, _preact.h)(_Input2.default, {
            value: this.state.name,
            placeholder: 'Enter a name for the view',
            onChange: function onChange(e) {
              return _this2.handleChange(e);
            }
          })
        ),
        (0, _preact.h)(
          _Grid.Flex,
          { wrap: true },
          this.props.rules.map(function (rule) {
            return (0, _preact.h)(
              _Grid.Box,
              { mb: 10, mr: 10, key: rule.id },
              (0, _preact.h)(_FilterDescription2.default, {
                rule: rule,
                edit: rule.name === sieve.SIMPLE_SEARCH_NAME ? false : function () {
                  return _this2.props.edit(rule);
                },
                'delete': function _delete() {
                  return _this2.props.delete(rule);
                }
              })
            );
          })
        )
      );
    }
  }]);

  return FilterSummary;
}(_preact.Component);

exports.default = FilterSummary;