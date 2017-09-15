'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  list-style: none;\n  padding: 0 !important;\n  margin: 0;\n'], ['\n  list-style: none;\n  padding: 0 !important;\n  margin: 0;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);\n  border: solid 0.5px #9b9b9b;\n'], ['\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);\n  border: solid 0.5px #9b9b9b;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  display: none;\n  position: absolute;\n  right: 230px;\n  width: 400px;\n  right: 302px;\n  top: 2px;\n  padding: 15px 15px 5px;\n'], ['\n  display: none;\n  position: absolute;\n  right: 230px;\n  width: 400px;\n  right: 302px;\n  top: 2px;\n  padding: 15px 15px 5px;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  position: relative;\n  padding: 7px 20px;\n  &:hover {\n    background-color: #f3f3f3;\n  }\n  & > ', ' {\n    padding-right: 20px;\n  }\n  & > button {\n    position: absolute;\n    top: 7px;\n    right: 10px;\n    padding: 8px;\n    background: none;\n    border: none;\n    display: none;\n  }\n  &:hover > button {\n    display: block;\n  }\n  &:hover ', ' {\n    display: block;\n  }\n'], ['\n  position: relative;\n  padding: 7px 20px;\n  &:hover {\n    background-color: #f3f3f3;\n  }\n  & > ', ' {\n    padding-right: 20px;\n  }\n  & > button {\n    position: absolute;\n    top: 7px;\n    right: 10px;\n    padding: 8px;\n    background: none;\n    border: none;\n    display: none;\n  }\n  &:hover > button {\n    display: block;\n  }\n  &:hover ', ' {\n    display: block;\n  }\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  position: absolute;\n  width: 300px;\n  right: 0;\n  top: 40px;\n  z-index: 1;\n'], ['\n  position: absolute;\n  width: 300px;\n  right: 0;\n  top: 40px;\n  z-index: 1;\n']);

var _preact = require('preact');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Divider = require('../Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Grid = require('../Grid');

var _Fixed = require('../Fixed');

var _Fixed2 = _interopRequireDefault(_Fixed);

var _Text = require('../Text');

var _Text2 = _interopRequireDefault(_Text);

var _fa = require('react-icons/lib/fa');

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _FilterDescription = require('./FilterDescription');

var _FilterDescription2 = _interopRequireDefault(_FilterDescription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Wrapper = _styledComponents2.default.div(_templateObject);

var UnstyledList = _styledComponents2.default.ul(_templateObject2);

var PlainPanel = _styledComponents2.default.div(_templateObject3);

var Preview = (0, _styledComponents2.default)(PlainPanel)(_templateObject4);

var ViewListItem = _styledComponents2.default.li(_templateObject5, _Text2.default, Preview);

var MenuPanel = (0, _styledComponents2.default)(PlainPanel)(_templateObject6);

var ViewsMenu = function (_Component) {
  _inherits(ViewsMenu, _Component);

  function ViewsMenu(props) {
    _classCallCheck(this, ViewsMenu);

    var _this = _possibleConstructorReturn(this, (ViewsMenu.__proto__ || Object.getPrototypeOf(ViewsMenu)).call(this, props));

    _this.state = {
      showViewsMenu: false
    };
    return _this;
  }

  _createClass(ViewsMenu, [{
    key: 'loadView',
    value: function loadView(view) {
      this.props.setRules(view.rules);
      this.setState({ showViewsMenu: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var views = this.props.views;

      var hasGlobalViews = views.global && !!views.global.length;
      var hasUserViews = views.user && !!views.user.length;
      return (0, _preact.h)(
        Wrapper,
        null,
        (0, _preact.h)(
          _Button2.default,
          {
            onClick: function onClick() {
              return _this2.setState({ showViewsMenu: !_this2.state.showViewsMenu });
            }
          },
          (0, _preact.h)(_fa.FaPieChart, { style: { marginRight: 10 } }),
          'Views',
          (0, _preact.h)(_fa.FaCaretDown, { style: { float: 'right' }, name: 'caret-down' })
        ),
        this.state.showViewsMenu && (0, _preact.h)(_Fixed2.default, {
          z: 1,
          onClick: function onClick() {
            return _this2.setState({ showViewsMenu: false });
          },
          top: true,
          right: true,
          bottom: true,
          left: true
        }),
        this.state.showViewsMenu && (0, _preact.h)(
          MenuPanel,
          { className: 'views-menu__panel' },
          !hasGlobalViews && !hasUserViews && (0, _preact.h)(
            _Grid.Box,
            { p: 3 },
            "You haven't created any views yet"
          ),
          hasGlobalViews && (0, _preact.h)(
            _Grid.Box,
            null,
            (0, _preact.h)(
              _Text2.default,
              { fontSize: 13, ml: 20, mb: 2, mt: 2, color: '#ccc' },
              'Global views'
            ),
            (0, _preact.h)(
              UnstyledList,
              null,
              views.global.map(function (view) {
                return (0, _preact.h)(
                  ViewListItem,
                  { key: view.name },
                  (0, _preact.h)(
                    _Text2.default,
                    { onClick: function onClick() {
                        return _this2.loadView(view);
                      } },
                    view.name,
                    (0, _preact.h)('br', null),
                    (0, _preact.h)(
                      _Text2.default,
                      { fontSize: 12 },
                      view.rules.length,
                      ' filter',
                      view.rules.length > 1 && 's'
                    )
                  ),
                  (0, _preact.h)(
                    'button',
                    null,
                    (0, _preact.h)(_fa.FaTrash, {
                      name: 'trash',
                      onClick: function onClick() {
                        return _this2.props.deleteView(view);
                      }
                    })
                  ),
                  (0, _preact.h)(
                    Preview,
                    null,
                    view.rules.map(function (rule) {
                      return (0, _preact.h)(
                        _Grid.Box,
                        { mb: 10, key: rule.id },
                        (0, _preact.h)(_FilterDescription2.default, { rule: rule })
                      );
                    })
                  )
                );
              })
            )
          ),
          hasGlobalViews && hasUserViews && (0, _preact.h)(_Divider2.default, { color: '#ccc' }),
          hasUserViews && (0, _preact.h)(
            _Grid.Box,
            null,
            (0, _preact.h)(
              _Text2.default,
              { fontSize: 13, ml: 20, mb: 2, mt: 2, color: '#ccc' },
              'Your views'
            ),
            (0, _preact.h)(
              UnstyledList,
              null,
              views.user.map(function (view) {
                return (0, _preact.h)(
                  ViewListItem,
                  { key: view.id },
                  (0, _preact.h)(
                    _Text2.default,
                    { onClick: function onClick() {
                        return _this2.loadView(view);
                      } },
                    view.name,
                    (0, _preact.h)('br', null),
                    (0, _preact.h)(
                      _Text2.default,
                      { fontSize: 12 },
                      view.rules.length,
                      ' filter',
                      view.rules.length > 1 && 's'
                    )
                  ),
                  (0, _preact.h)(
                    'button',
                    null,
                    (0, _preact.h)(_fa.FaTrash, {
                      name: 'trash',
                      onClick: function onClick() {
                        return _this2.props.deleteView(view);
                      }
                    })
                  ),
                  (0, _preact.h)(
                    Preview,
                    null,
                    view.rules.map(function (rule) {
                      return (0, _preact.h)(
                        _Grid.Box,
                        { mb: 10, key: rule.id },
                        (0, _preact.h)(_FilterDescription2.default, { rule: rule })
                      );
                    })
                  )
                );
              })
            )
          )
        )
      );
    }
  }]);

  return ViewsMenu;
}(_preact.Component);

exports.default = ViewsMenu;