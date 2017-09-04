import * as BooleanType from './Boolean'
import * as CaseInsensitiveTextType from './CaseInsensitiveText'
import * as DateTimeType from './DateTime'
import * as DateType from './Date'
import * as IntegerType from './Integer'
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
  Real: RealType,
  'Short Text': ShortTextType,
  Text: TextType,
  Time: TimeType,

  'Semver Range': SemverRangeType,
  Semver: SemverType
}
