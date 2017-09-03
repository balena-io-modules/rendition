import { h } from 'preact'
import { ThemeProvider } from 'styled-components'
import defaultTheme from '../theme'

const Provider = ({ theme, ...props }) => {
  return (<ThemeProvider theme={theme || defaultTheme} {...props} />);
}

export default Provider;
