'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Boolean = require('./Boolean');

var BooleanType = _interopRequireWildcard(_Boolean);

var _CaseInsensitiveText = require('./CaseInsensitiveText');

var CaseInsensitiveTextType = _interopRequireWildcard(_CaseInsensitiveText);

var _DateTime = require('./DateTime');

var DateTimeType = _interopRequireWildcard(_DateTime);

var _Date = require('./Date');

var DateType = _interopRequireWildcard(_Date);

var _Integer = require('./Integer');

var IntegerType = _interopRequireWildcard(_Integer);

var _Real = require('./Real');

var RealType = _interopRequireWildcard(_Real);

var _ShortText = require('./ShortText');

var ShortTextType = _interopRequireWildcard(_ShortText);

var _Text = require('./Text');

var TextType = _interopRequireWildcard(_Text);

var _Time = require('./Time');

var TimeType = _interopRequireWildcard(_Time);

var _SemverRange = require('./SemverRange');

var SemverRangeType = _interopRequireWildcard(_SemverRange);

var _Semver = require('./Semver');

var SemverType = _interopRequireWildcard(_Semver);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  Boolean: BooleanType,
  'Case Insensitive Text': CaseInsensitiveTextType,
  'Date Time': DateTimeType,
  Date: DateType,
  Integer: IntegerType,
  Real: RealType,
  'Short Text': ShortTextType,
  Text: TextType,
  Time: TimeType,

  'Semver Range': SemverRangeType,
  Semver: SemverType
};