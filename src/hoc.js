import { h } from 'preact'
import { compose } from 'recompose'
import getDisplayName from 'recompose/getDisplayName'
import styled from 'styled-components'
import {
  space,
  width,
  fontSize,
  color
} from 'styled-system'
import {
  arrayOf,
  oneOfType,
  number,
  string
} from 'prop-types'
import tag from 'tag-hoc'
import blacklist from './blacklist'

const prop = oneOfType([
  number,
  string,
  arrayOf(oneOfType([
    number,
    string
  ]))
])

const propTypes = {
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
  py: prop,
}

const withStyledSystem = (child) => {
  const Base = styled(child)`
   ${space}
   ${width}
   ${fontSize}
   ${color}
  `

  Base.displayName = getDisplayName(child)
  Base.propTypes = propTypes

  return (props) => {
    return <Base {...props} />
  }
}

const Tag = tag(blacklist);

export default compose(withStyledSystem, Tag)
