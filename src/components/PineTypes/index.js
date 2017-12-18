import * as BooleanType from './Boolean'
import * as CaseInsensitiveTextType from './CaseInsensitiveText'
import * as DateTimeType from './DateTime'
import * as DateType from './Date'
import * as EnumType from './Enum'
import * as IntegerType from './Integer'
import * as KeyValuePair from './KeyValuePair'
import * as RealType from './Real'
import * as ShortTextType from './ShortText'
import * as TextType from './Text'
import * as TimeType from './Time'

import * as SemverRangeType from './SemverRange'
import * as SemverType from './Semver'

export default {
  Boolean: BooleanType,
  'Case Insensitive Text': CaseInsensitiveTextType,
  'Date Time': DateTimeType,
  Date: DateType,
  Integer: IntegerType,
  'Key Value Pair': KeyValuePair,
  Real: RealType,
  'Short Text': ShortTextType,
  Text: TextType,
  Time: TimeType,

  Enum: EnumType,
  'Semver Range': SemverRangeType,
  Semver: SemverType
}
