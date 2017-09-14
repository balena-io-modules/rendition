'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: ', ';\n  background-size: cover;\n  background-position: center;\n  background-image: ', '\n'], ['\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: ', ';\n  background-size: cover;\n  background-position: center;\n  background-image: ', '\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var setDefaultProps = (0, _recompose.withProps)(function (props) {
  // set defaults
  // always allow override with provided props
  return Object.assign({
    p: [3, 4],
    minHeight: '80vh'
  }, props);
});

var setBgImage = function setBgImage(bgImage) {
  return bgImage ? 'url(' + bgImage + ')' : 'none';
};

var Base = _styledComponents2.default.div(_templateObject, function (props) {
  return props.minHeight;
}, function (props) {
  return setBgImage(props.backgroundImage);
});

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, setDefaultProps, _hoc2.default)(Base);