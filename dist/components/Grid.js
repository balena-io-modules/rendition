'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Box = exports.Flex = undefined;

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _gridStyled = require('grid-styled');

var _styledSystem = require('styled-system');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Flex = exports.Flex = (0, _styledComponents2.default)(_gridStyled.Flex)([], _styledSystem.fontSize, _styledSystem.color);
var Box = exports.Box = (0, _styledComponents2.default)(_gridStyled.Box)([], _styledSystem.fontSize, _styledSystem.color);