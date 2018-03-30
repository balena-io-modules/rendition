import styled from 'styled-components'
import { color, fontSize, space } from 'styled-system'
import asRendition from '../asRendition'
import { monospace } from '../utils'
import { align, bold, caps } from './Text'

const Heading = styled.h3`
  ${align}
  ${color}
  ${fontSize}
  ${monospace};
  ${space}

  ${caps}
  ${bold}
`

Heading.displayName = 'Heading'

Heading.defaultProps = {
  fontSize: 4,
  m: 0
}

const Base = asRendition(Heading)

Base.h1 = asRendition(Heading.withComponent('h1'))
Base.h1.defaultProps = {
  fontSize: 6,
  m: 0
}

Base.h2 = asRendition(Heading.withComponent('h2'))
Base.h2.defaultProps = {
  fontSize: 5,
  m: 0
}

Base.h3 = asRendition(Heading.withComponent('h3'))
Base.h3.defaultProps = {
  fontSize: 4,
  m: 0
}

Base.h4 = asRendition(Heading.withComponent('h4'))
Base.h4.defaultProps = {
  fontSize: 3,
  m: 0
}

Base.h5 = asRendition(Heading.withComponent('h5'))
Base.h5.defaultProps = {
  fontSize: 2,
  m: 0
}

Base.h6 = asRendition(Heading.withComponent('h6'))
Base.h6.defaultProps = {
  fontSize: 1,
  m: 0
}

export default Base
