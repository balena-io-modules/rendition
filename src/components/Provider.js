import { h } from 'preact'
import styled, { ThemeProvider } from 'styled-components'
import defaultTheme from '../theme'

const Base = styled.div`font-family: ${props => props.theme.font};`

const Provider = ({ theme, ...props }) => {
  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <Base {...props} />
    </ThemeProvider>
  )
}

export default Provider
