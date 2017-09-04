import RegexParser from 'regex-parser'
import _ from 'lodash'
import { h } from 'preact'
import Textarea from '../Textarea'
import showdown from 'showdown'

const converter = new showdown.Converter()

export const rules = {
  is: (target = '', value) => target === value,
  contains: (target = '', value) => target.includes(value),
  'does not contain': (target = '', value) => !target.includes(value),
  'matches RegEx': (target = '', value) => target.match(RegexParser(value)),
  'does not match RegEx': (target = '', value) =>
    !target.match(RegexParser(value))
}

export const validate = _.isString

export const Edit = ({ onChange, ...props }) => (
  <Textarea onChange={e => onChange(e.target.value)} {...props} />
)

export const Display = ({ data, ...props }) => (
  <div
    {...props}
    className='markdown-body'
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(data) }}
  />
)
