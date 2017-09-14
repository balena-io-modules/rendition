'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: block;\n  color: ', ';\n\n  /* fix edge hover missplacing bug\n    on svg text inside anchors\n  */\n  &,\n  &:hover {\n    text-decoration: none;\n\n    text {\n      text-decoration: none !important;\n    }\n\n    .device-status-gauge__graph__total-devices-label,\n    .device-status-gauge__graph__total-devices-number {\n      transform: translateX(0);\n    }\n  }\n\n  .device-status-gauge__graph {\n    display: block;\n    width: 100%;\n    max-width: 180px;\n    margin: 0 auto 10px;\n  }\n\n  .device-status-gauge__graph__total-devices-label {\n    font-family: ', ';\n    font-size: 5px;\n    fill: #b8b8b8;\n    text-anchor: middle;\n  }\n\n  .device-status-gauge__graph__total-devices-number {\n    font-family: ', ';\n    font-size: 26px;\n    fill: #5e5e5e;\n    letter-spacing: -1px;\n    text-anchor: middle;\n  }\n\n  .device-status-gauge__statuses {\n    .clearfix;\n    list-style: none;\n    padding: 5px;\n    margin: 0 auto;\n    background: white;\n    border-radius: 5px;\n    max-width: 240px;\n    border: 1px solid #ececec;\n    overflow: hidden;\n  }\n\n  .device-status-gauge__status {\n    display: flex;\n    padding: 3px 0 3px 2px;\n    line-height: 9px;\n    width: 50%;\n    float: left;\n  }\n\n  .device-status-gauge__status--post-provisioning {\n    width: 100%;\n  }\n\n  .device-status-gauge__status__color {\n    display: inline-block;\n    flex: 0 0 auto;\n    width: 10px;\n    height: 10px;\n    margin-right: 4px;\n  }\n\n  .device-status-gauge__status__name {\n    font-size: 11px;\n  }\n  .block-status-idle {\n    background-color: ', ';\n  }\n  .block-status-configuring {\n    background-color: ', ';\n  }\n  .block-status-updating {\n    background-color: ', ';\n  }\n  .block-status-post-provisioning {\n    background-color: ', ';\n  }\n  .block-status-offline {\n    background-color: ', ';\n  }\n'], ['\n  display: block;\n  color: ', ';\n\n  /* fix edge hover missplacing bug\n    on svg text inside anchors\n  */\n  &,\n  &:hover {\n    text-decoration: none;\n\n    text {\n      text-decoration: none !important;\n    }\n\n    .device-status-gauge__graph__total-devices-label,\n    .device-status-gauge__graph__total-devices-number {\n      transform: translateX(0);\n    }\n  }\n\n  .device-status-gauge__graph {\n    display: block;\n    width: 100%;\n    max-width: 180px;\n    margin: 0 auto 10px;\n  }\n\n  .device-status-gauge__graph__total-devices-label {\n    font-family: ', ';\n    font-size: 5px;\n    fill: #b8b8b8;\n    text-anchor: middle;\n  }\n\n  .device-status-gauge__graph__total-devices-number {\n    font-family: ', ';\n    font-size: 26px;\n    fill: #5e5e5e;\n    letter-spacing: -1px;\n    text-anchor: middle;\n  }\n\n  .device-status-gauge__statuses {\n    .clearfix;\n    list-style: none;\n    padding: 5px;\n    margin: 0 auto;\n    background: white;\n    border-radius: 5px;\n    max-width: 240px;\n    border: 1px solid #ececec;\n    overflow: hidden;\n  }\n\n  .device-status-gauge__status {\n    display: flex;\n    padding: 3px 0 3px 2px;\n    line-height: 9px;\n    width: 50%;\n    float: left;\n  }\n\n  .device-status-gauge__status--post-provisioning {\n    width: 100%;\n  }\n\n  .device-status-gauge__status__color {\n    display: inline-block;\n    flex: 0 0 auto;\n    width: 10px;\n    height: 10px;\n    margin-right: 4px;\n  }\n\n  .device-status-gauge__status__name {\n    font-size: 11px;\n  }\n  .block-status-idle {\n    background-color: ', ';\n  }\n  .block-status-configuring {\n    background-color: ', ';\n  }\n  .block-status-updating {\n    background-color: ', ';\n  }\n  .block-status-post-provisioning {\n    background-color: ', ';\n  }\n  .block-status-offline {\n    background-color: ', ';\n  }\n']);

var _preact = require('preact');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pie = require('paths-js/pie');

var _pie2 = _interopRequireDefault(_pie);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _recompose = require('recompose');

var _resinDeviceStatus = require('resin-device-status');

var _resinDeviceStatus2 = _interopRequireDefault(_resinDeviceStatus);

var _hoc = require('../hoc');

var _hoc2 = _interopRequireDefault(_hoc);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var colors = _theme2.default.colors,
    font = _theme2.default.font;


var DeviceStatusGaugeWrapper = _styledComponents2.default.div(_templateObject, function (_ref) {
  var theme = _ref.theme;
  return theme.colors.text.main;
}, font, font, colors.statusIdle.main, colors.statusConfiguring.main, colors.statusUpdating.main, colors.statusPostProvisioning.main, colors.statusOffline.main);

var getDefaultPlaceholderState = function getDefaultPlaceholderState() {
  return {
    count: 0,
    key: _resinDeviceStatus2.default.status.OFFLINE,
    name: _lodash2.default.get(_resinDeviceStatus2.default.statuses.find(function (s) {
      return s.key === _resinDeviceStatus2.default.status.OFFLINE;
    }), 'name', 'Offline'),
    value: 1
  };
};

var pathFillColor = function pathFillColor(status) {
  if (status === 'idle') {
    return colors.statusIdle.main;
  }

  if (status === 'configuring') {
    return colors.statusConfiguring.main;
  }

  if (status === 'updating') {
    return colors.statusUpdating.main;
  }

  if (status === 'post-provisioning') {
    return colors.statusPostProvisioning.main;
  }

  if (status === 'offline') {
    return colors.statusOffline.main;
  }
};

var DeviceStatusGauge = function DeviceStatusGauge(_ref2) {
  var devices = _ref2.devices,
      props = _objectWithoutProperties(_ref2, ['devices']);

  var data = [];
  var allDevices = devices || [];
  var statuses = _resinDeviceStatus2.default.statuses;

  _resinDeviceStatus2.default.statuses.forEach(function (status) {
    var devices = _lodash2.default.filter(allDevices, function (d) {
      return _resinDeviceStatus2.default.getStatus(d).key === status.key;
    });

    if (devices.length) {
      data.push({
        count: devices.length,
        key: status.key,
        name: status.name,
        value: devices.length
      });
    }
  });

  var placeholderState = data.length === 1 ? data[0] : getDefaultPlaceholderState();

  var graph = (0, _pie2.default)({
    accessor: function accessor(item) {
      return item.value;
    },
    center: [0, 0],
    data: data,
    R: 46,
    r: 25
  });

  var gauge = graph.curves;
  var totalDevices = allDevices.length;
  return (0, _preact.h)(
    DeviceStatusGaugeWrapper,
    props,
    (0, _preact.h)(
      'svg',
      {
        'class': 'device-status-gauge__graph',
        viewBox: '0 0 100 100',
        xmlns: 'http://www.w3.org/2000/svg'
      },
      (0, _preact.h)('circle', {
        fill: ' white',
        stroke: '#dadada',
        'stroke-width': '5',
        cx: '50',
        cy: '50',
        r: '46'
      }),
      (0, _preact.h)(
        'g',
        null,
        (0, _preact.h)('circle', {
          fill: pathFillColor(placeholderState.key),
          cx: '50',
          cy: '50',
          r: '46'
        }),
        (0, _preact.h)('circle', { fill: 'white', cx: '50', cy: '50', r: '25' }),
        (0, _preact.h)(
          'title',
          { 'ng-if': 'placeholderState.count' },
          placeholderState.name,
          ': devices'
        )
      ),
      (0, _preact.h)(
        'g',
        { transform: 'translate(50, 50)' },
        _lodash2.default.map(gauge, function (segment) {
          return (0, _preact.h)(
            'g',
            null,
            !!segment.item.count && (0, _preact.h)(
              'title',
              null,
              segment.item.name,
              ': devices'
            ),
            (0, _preact.h)('path', {
              fill: pathFillColor(segment.item.key),
              d: segment.sector.path.print()
            })
          );
        })
      ),
      (0, _preact.h)(
        'text',
        {
          'class': 'device-status-gauge__graph__total-devices-label',
          x: '50',
          y: '41'
        },
        'TOTAL DEVICES'
      ),
      (0, _preact.h)(
        'text',
        {
          'class': 'device-status-gauge__graph__total-devices-number',
          x: '50',
          y: '63'
        },
        totalDevices
      )
    ),
    (0, _preact.h)(
      'ul',
      { 'class': 'device-status-gauge__statuses' },
      _lodash2.default.map(statuses, function (status) {
        return (0, _preact.h)(
          'li',
          {
            className: 'col-xs-6 device-status-gauge__status device-status-gauge__status--' + status.key
          },
          (0, _preact.h)(
            'span',
            {
              className: 'device-status-gauge__status__color block-status-' + status.key
            },
            '\xA0'
          ),
          (0, _preact.h)(
            'span',
            { 'class': 'device-status-gauge__status__name' },
            status.name
          )
        );
      })
    )
  );
};

exports.default = (0, _recompose.compose)(_styledComponents.withTheme, _hoc2.default)(DeviceStatusGauge);