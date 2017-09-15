'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  position: relative;\n  width: 500px;\n  border-bottom: 2px solid #ccc;\n  padding-left: 20px;\n  padding-top: 3px;\n  margin-left: 30px;\n  margin-right: 30px;\n\n  .search-icon {\n    position: absolute;\n    top: 7px;\n    left: 0;\n    color: #9b9b9b;\n  }\n\n  input {\n    box-shadow: none;\n    border: none;\n    width: 100%;\n    font-size: inherit;\n    padding: 5px;\n    ::placeholder {\n      font-style: italic;\n      color: #9b9b9b;\n    }\n  }\n'], ['\n  position: relative;\n  width: 500px;\n  border-bottom: 2px solid #ccc;\n  padding-left: 20px;\n  padding-top: 3px;\n  margin-left: 30px;\n  margin-right: 30px;\n\n  .search-icon {\n    position: absolute;\n    top: 7px;\n    left: 0;\n    color: #9b9b9b;\n  }\n\n  input {\n    box-shadow: none;\n    border: none;\n    width: 100%;\n    font-size: inherit;\n    padding: 5px;\n    ::placeholder {\n      font-style: italic;\n      color: #9b9b9b;\n    }\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['position: relative;'], ['position: relative;']);

var _preact = require('preact');

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _fa = require('react-icons/lib/fa');

var _Summary = require('./Summary');

var _Summary2 = _interopRequireDefault(_Summary);

var _ViewsMenu = require('./ViewsMenu');

var _ViewsMenu2 = _interopRequireDefault(_ViewsMenu);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _Modal = require('../Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Select = require('../Select');

var _Select2 = _interopRequireDefault(_Select);

var _Grid = require('../Grid');

var _utils = require('../../utils');

var utils = _interopRequireWildcard(_utils);

var _SchemaSieve = require('./SchemaSieve');

var _SchemaSieve2 = _interopRequireDefault(_SchemaSieve);

var _PineTypes = require('../PineTypes');

var _PineTypes2 = _interopRequireDefault(_PineTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * The filter component requires the following props:
 * rules - an array of filter rule objects
 * schema - a SchemaSieve schema
 * views - an object with two keys, 'global' and 'user', each of which contains an array of predefined filter views,
 * setRules - a method that is called to set rules
 * setViews - a method that is called to set views
 */

var sieve = (0, _SchemaSieve2.default)();

var SimpleSearchBox = _styledComponents2.default.div(_templateObject);

var FilterWrapper = (0, _styledComponents2.default)(_Grid.Box)(_templateObject2);

var FilterInput = function FilterInput(props) {
  var PineTypeInput = _PineTypes2.default[props.type].Edit;

  return (0, _preact.h)(PineTypeInput, { value: props.value, onChange: props.onChange });
};

var Filters = function (_Component) {
  _inherits(Filters, _Component);

  function Filters(props) {
    _classCallCheck(this, Filters);

    var _this = _possibleConstructorReturn(this, (Filters.__proto__ || Object.getPrototypeOf(Filters)).call(this, props));

    _this.toggleModal = _this.toggleModal.bind(_this);
    _this.handleEditChange = _this.handleEditChange.bind(_this);
    _this.generateFreshEdit = _this.generateFreshEdit.bind(_this);

    var rules = _this.props.rules;

    var existingRule = (0, _find2.default)(rules, { name: sieve.SIMPLE_SEARCH_NAME });

    _this.state = {
      showModal: false,
      edit: _this.generateFreshEdit(),
      searchString: existingRule && existingRule.value || ''
    };
    return _this;
  }

  _createClass(Filters, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentRules = nextProps.rules;
      var existing = (0, _find2.default)(currentRules, { name: sieve.SIMPLE_SEARCH_NAME });
      if (existing) {
        var value = existing.value;

        if (value !== this.state.searchString) {
          this.setState({ searchString: value });
        }
      } else {
        this.setState({ searchString: '' });
      }
    }
  }, {
    key: 'generateFreshEdit',
    value: function generateFreshEdit() {
      if (!this.props.schema) {
        return {};
      }
      var inputModels = sieve.makeFilterInputs(this.props.schema);

      var edit = {
        name: Object.keys(inputModels).shift(),
        value: ''
      };

      edit.operator = inputModels[edit.name].availableOperators[0];

      return edit;
    }
  }, {
    key: 'addFilterRule',
    value: function addFilterRule(rule) {
      var rules = this.props.rules;

      rules.push(rule);
      this.props.setRules(rules);
    }
  }, {
    key: 'editFilterRule',
    value: function editFilterRule(rule) {
      var rules = this.props.rules;

      var updatedRules = rules.map(function (r) {
        return r.id === rule ? rule : r;
      });

      this.props.setRules(updatedRules);
    }
  }, {
    key: 'addRule',
    value: function addRule(rule) {
      var inputModels = sieve.makeFilterInputs(this.props.schema);

      if (!rule) {
        rule = (0, _cloneDeep2.default)(this.state.edit);
      }
      var baseRule = inputModels[rule.name];
      var newRule = (0, _assign2.default)((0, _cloneDeep2.default)(baseRule), rule);

      if (newRule.id) {
        this.editFilterRule(newRule);
      } else {
        newRule.id = utils.randomString();
        this.addFilterRule(newRule);
      }
      this.setState({
        showModal: false,
        edit: this.generateFreshEdit()
      });
    }
  }, {
    key: 'updateSimpleSearch',
    value: function updateSimpleSearch(val) {
      this.setState({ searchString: val });
      var rules = this.props.rules;

      var existingRule = (0, _find2.default)(rules, { name: sieve.SIMPLE_SEARCH_NAME });
      if (existingRule) {
        existingRule.value = val;
        this.editFilterRule(existingRule);
      } else {
        this.addFilterRule({
          name: sieve.SIMPLE_SEARCH_NAME,
          value: val,
          id: utils.randomString()
        });
      }
    }
  }, {
    key: 'toggleModal',
    value: function toggleModal() {
      this.setState({ showModal: !this.state.showModal });
    }
  }, {
    key: 'showEditModal',
    value: function showEditModal(rule) {
      this.setState({
        showModal: true,
        edit: rule
      });
    }
  }, {
    key: 'removeRule',
    value: function removeRule(rule) {
      if (rule.name === sieve.SIMPLE_SEARCH_NAME) {
        this.setState({ searchString: '' });
      }

      var rules = this.props.rules;


      var updatedRules = rules.filter(function (r) {
        return r.id !== rule.id;
      });
      this.props.setRules(updatedRules);
    }
  }, {
    key: 'handleEditChange',
    value: function handleEditChange(value, attribute) {
      var update = this.state.edit;
      var inputModels = sieve.makeFilterInputs(this.props.schema);

      if (attribute === 'name' && update.name !== value) {
        update.name = value;
        update.operator = inputModels[value].availableOperators[0];
        update.value = '';
      } else {
        update[attribute] = value;
      }

      this.setState({ edit: update });
    }
  }, {
    key: 'saveView',
    value: function saveView(name, scope) {
      var rules = this.props.rules;
      var views = this.props.views;


      var newView = {
        name: name,
        rules: rules,
        id: utils.randomString(),
        scope: scope
      };

      if (!views) {
        views = {};
      }

      if (scope === 'global') {
        if (!views.global) {
          views.global = [];
        }
        views[scope].push(newView);
      } else {
        if (!views[scope]) {
          views[scope] = {};
        }
        if (!views[scope]) {
          views[scope] = [];
        }
        views[scope].push(newView);
      }

      this.props.setViews(views);
    }
  }, {
    key: 'deleteView',
    value: function deleteView(view) {
      var views = this.props.views;


      if (view.scope === 'global') {
        views.global = views.global.filter(function (item) {
          return item.id !== view.id;
        });
      } else {
        views[view.scope] = views[view.scope].filter(function (item) {
          return item.id !== view.id;
        });
      }

      this.props.setViews(views);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var inputModels = sieve.makeFilterInputs(this.props.schema);
      var rules = this.props.rules || [];

      return (0, _preact.h)(
        FilterWrapper,
        { mb: 3 },
        (0, _preact.h)(
          _Grid.Flex,
          { justify: 'space-between' },
          (0, _preact.h)(
            _Button2.default,
            { primary: true, onClick: function onClick() {
                return _this2.toggleModal();
              } },
            (0, _preact.h)(_fa.FaFilter, { style: { marginRight: 10 } }),
            'Add filter'
          ),
          (0, _preact.h)(
            SimpleSearchBox,
            null,
            (0, _preact.h)('input', {
              placeholder: 'Search entries...',
              value: this.state.searchString,
              onChange: function onChange(e) {
                return _this2.updateSimpleSearch(e.target.value);
              }
            }),
            (0, _preact.h)(_fa.FaSearch, { className: 'search-icon', name: 'search' })
          ),
          (0, _preact.h)(_ViewsMenu2.default, {
            rules: rules,
            views: this.props.views || [],
            setRules: this.props.setRules,
            deleteView: function deleteView(view) {
              return _this2.deleteView(view);
            }
          })
        ),
        this.state.showModal && (0, _preact.h)(
          'div',
          null,
          (0, _preact.h)(
            _Modal2.default,
            {
              title: 'Add a New Filter',
              cancel: function cancel() {
                return _this2.setState({ showModal: false });
              },
              done: function done() {
                return _this2.addRule();
              },
              action: this.state.edit.id ? 'Update filter' : 'Add filter'
            },
            (0, _preact.h)(
              'form',
              { onSubmit: function onSubmit(e) {
                  return e.preventDefault() && _this2.addRule();
                } },
              (0, _preact.h)(
                _Grid.Flex,
                null,
                (0, _preact.h)(
                  _Select2.default,
                  {
                    mr: 20,
                    value: this.state.edit.name,
                    onChange: function onChange(e) {
                      return _this2.handleEditChange(e.target.value, 'name');
                    }
                  },
                  (0, _map2.default)(inputModels, function (_ref) {
                    var name = _ref.name;
                    return (0, _preact.h)(
                      'option',
                      null,
                      name
                    );
                  })
                ),
                (0, _preact.h)(
                  _Select2.default,
                  {
                    mr: 20,
                    value: this.state.edit.operator,
                    onChange: function onChange(e) {
                      return _this2.handleEditChange(e.target.value, 'operator');
                    }
                  },
                  (0, _map2.default)(inputModels[this.state.edit.name].availableOperators, function (name) {
                    return (0, _preact.h)(
                      'option',
                      null,
                      name
                    );
                  })
                ),
                (0, _preact.h)(FilterInput, {
                  value: this.state.edit.value,
                  onChange: function onChange(value) {
                    return _this2.handleEditChange(value, 'value');
                  },
                  type: inputModels[this.state.edit.name].type
                })
              )
            )
          )
        ),
        !!rules.length && (0, _preact.h)(_Summary2.default, {
          edit: function edit(rule) {
            return _this2.showEditModal(rule);
          },
          'delete': function _delete(rule) {
            return _this2.removeRule(rule);
          },
          saveView: function saveView(name, scope) {
            return _this2.saveView(name, scope);
          },
          rules: rules,
          views: this.props.views || {}
        })
      );
    }
  }]);

  return Filters;
}(_preact.Component);

exports.default = Filters;