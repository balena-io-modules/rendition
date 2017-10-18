import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import {
  fontSize,
  space,
  color,
  textAlign,
  responsiveStyle
} from 'styled-system'

const maxWidth = responsiveStyle('max-width', 'maxWidth')

const Container = styled.div`
  ${textAlign} ${maxWidth} ${fontSize} ${space} ${color};
`

Container.displayName = 'Container'
Container.defaultProps = {
  px: 3,
  ml: 'auto',
  mr: 'auto'
}

export default withTheme(({ theme, ...props }) => {
  return (
    <Container
      {...props}
      maxWidth={theme.breakpoints.map((bp, i) => `${bp - theme.space[i]}em`)}
    />
  )
})
