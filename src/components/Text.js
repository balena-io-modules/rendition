import styled from 'styled-components'
import { fontSize, space, color, responsiveStyle } from 'styled-system'

export const caps = props =>
  props.caps
    ? {
      textTransform: 'uppercase',
      letterSpacing: '0.2em'
    }
    : null

export const bold = props =>
  props.bold
    ? { fontWeight: props.theme.weights[props.theme.weights.length - 1] }
    : null

const align = responsiveStyle('text-align', 'align')

const Text = styled.div`
  ${fontSize} ${space} ${color} ${caps} ${bold} ${align};
`

Text.displayName = 'Text'
Text.span = Text.withComponent('span')
Text.p = Text.withComponent('p')

export default Text
