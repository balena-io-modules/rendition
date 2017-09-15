'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  border: 0;\n  background: none;\n  padding: 4px;\n  font-size: 14px;\n  margin-left: 5px;\n  color: rgba(0, 0, 0, 0.4);\n  cursor: pointer;\n\n  &:hover {\n    color: black;\n  }\n'], ['\n  border: 0;\n  background: none;\n  padding: 4px;\n  font-size: 14px;\n  margin-left: 5px;\n  color: rgba(0, 0, 0, 0.4);\n  cursor: pointer;\n\n  &:hover {\n    color: black;\n  }\n']);

var _preact = require('preact');

var _fa = require('react-icons/lib/fa');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var BtnWrapper = _styledComponents2.default.button(_templateObject);
var Base = function Base(props) {
  return (0, _preact.h)(
    BtnWrapper,
    props,
    (0, _preact.h)(_fa.FaClose, null)
  );
};
exports.default = (0, _recompose.compose)(_styledComponents.withTheme, _hoc2.default)(Base);