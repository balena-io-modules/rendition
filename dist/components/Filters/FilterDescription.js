'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: 13px;\n  height: 22px;\n  border: 0;\n  border-radius: 3px;\n  background-color: #e9e9e9;\n  padding: 3px 8px;\n'], ['\n  font-size: 13px;\n  height: 22px;\n  border: 0;\n  border-radius: 3px;\n  background-color: #e9e9e9;\n  padding: 3px 8px;\n']);

var _preact = require('preact');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _DeleteButton = require('../DeleteButton');

var _DeleteButton2 = _interopRequireDefault(_DeleteButton);

var _Grid = require('../Grid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ButtonWrapper = _styledComponents2.default.button(_templateObject);

var FilterDescription = function FilterDescription(props) {
  return (0, _preact.h)(
    'div',
    null,
    (0, _preact.h)(
      ButtonWrapper,
      { onClick: !!props.edit && props.edit },
      (0, _preact.h)(
        _Grid.Flex,
        null,
        props.rule.name,
        ' ',
        (0, _preact.h)(
          _Grid.Box,
          { mx: 7 },
          (0, _preact.h)(
            'strong',
            null,
            props.rule.operator
          )
        ),
        ' ',
        (0, _preact.h)(
          'em',
          null,
          props.rule.value
        )
      )
    ),
    !!props.delete && (0, _preact.h)(_DeleteButton2.default, { onClick: props.delete })
  );
};

exports.default = FilterDescription;