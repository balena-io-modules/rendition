'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  border-radius: 2px;\n  background-color: #ffffff;\n  border: solid 0.5px #9b9b9b;\n  position: fixed;\n  width: ', ';\n  top: 225px;\n  min-height: 50px;\n  left: 50%;\n  margin-left: -', ';\n  padding: 30px 50px;\n  z-index: 10;\n  box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.4);\n\n  @media (max-width: 730px) {\n    left: 15px;\n    right: 15px;\n    margin: 0;\n    width: auto;\n  }\n'], ['\n  border-radius: 2px;\n  background-color: #ffffff;\n  border: solid 0.5px #9b9b9b;\n  position: fixed;\n  width: ', ';\n  top: 225px;\n  min-height: 50px;\n  left: 50%;\n  margin-left: -', ';\n  padding: 30px 50px;\n  z-index: 10;\n  box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.4);\n\n  @media (max-width: 730px) {\n    left: 15px;\n    right: 15px;\n    margin: 0;\n    width: auto;\n  }\n']);

var _preact = require('preact');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _Fixed = require('./Fixed');

var _Fixed2 = _interopRequireDefault(_Fixed);

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _utils = require('../utils');

var _Grid = require('./Grid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var MODAL_WIDTH = 700;

var ModalPanel = _styledComponents2.default.div(_templateObject, (0, _utils.px)(MODAL_WIDTH), (0, _utils.px)(MODAL_WIDTH / 2));

var Modal = function Modal(props) {
  return (0, _preact.h)(
    'div',
    null,
    (0, _preact.h)(_Fixed2.default, {
      z: 9,
      bg: 'rgba(0,0,0,0.4)',
      top: true,
      right: true,
      bottom: true,
      left: true,
      onClick: function onClick() {
        return props.cancel();
      }
    }),
    (0, _preact.h)(
      ModalPanel,
      null,
      !!props.title && (0, _preact.h)(
        _Text2.default,
        { mb: 50 },
        (0, _preact.h)(
          'strong',
          null,
          props.title
        )
      ),
      props.children,
      (0, _preact.h)(
        _Grid.Flex,
        { mt: 60, align: 'center', justify: 'center' },
        (0, _preact.h)(
          _Button2.default,
          { style: { marginRight: 20 }, onClick: props.cancel },
          'Cancel'
        ),
        (0, _preact.h)(
          _Button2.default,
          { primary: true, onClick: props.done },
          props.action
        )
      )
    )
  );
};

exports.default = Modal;