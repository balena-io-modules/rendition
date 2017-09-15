'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['', ' ', ' ', ' ', ';'], ['', ' ', ' ', ' ', ';']);

var _preact = require('preact');

var _recompose = require('recompose');

var _getDisplayName = require('recompose/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledSystem = require('styled-system');

var _propTypes = require('prop-types');

var _tagHoc = require('tag-hoc');

var _tagHoc2 = _interopRequireDefault(_tagHoc);

var _blacklist = require('./blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var prop = (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string, (0, _propTypes.arrayOf)((0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string]))]);

var propTypes = {
  width: prop,
  w: prop,
  fontSize: prop,
  f: prop,
  color: prop,
  bg: prop,
  m: prop,
  mt: prop,
  mr: prop,
  mb: prop,
  ml: prop,
  mx: prop,
  my: prop,
  p: prop,
  pt: prop,
  pr: prop,
  pb: prop,
  pl: prop,
  px: prop,
  py: prop
};

var withStyledSystem = function withStyledSystem(child) {
  var Base = (0, _styledComponents2.default)(child)(_templateObject, _styledSystem.space, _styledSystem.width, _styledSystem.fontSize, _styledSystem.color);

  Base.displayName = (0, _getDisplayName2.default)(child);
  Base.propTypes = propTypes;

  return function (props) {
    return (0, _preact.h)(Base, props);
  };
};

var Tag = (0, _tagHoc2.default)(_blacklist2.default);

exports.default = (0, _recompose.compose)(withStyledSystem, Tag);