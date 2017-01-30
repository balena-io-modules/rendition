import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';

const TestContainer = ({ children }) => {
  return(
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default TestContainer;
