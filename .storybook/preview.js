import * as React from "react";
// import { useDarkMode } from 'storybook-dark-mode'
import { createGlobalStyle } from "styled-components";
import theme from "../src/theme";
import { Provider } from "../src/index";
import { EXTRA_FORMATS } from "../src/components/Renderer/examples";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
};

const GlobalStyle = createGlobalStyle([], {
  "*": {
    boxSizing: "border-box",
  },
  body: {
    lineHeight: 1.5,
    margin: 0,
    fontFamily: theme.font,
    webkitFontSmoothing: "antialiased",
  },
});

const ThemeProvider = ({ children }) => {
  // const isDark = useDarkMode()
  const isDark = false;

  return (
    <React.Fragment>
      <GlobalStyle />
      <Provider
        widgets={{
          renderer: {
            formats: EXTRA_FORMATS,
          },
        }}
        theme={
          isDark
            ? {
                colors: {
                  text: {
                    main: "white",
                    light: "white",
                    dark: "gray",
                  },
                },
              }
            : {}
        }
      >
        {children}
      </Provider>
    </React.Fragment>
  );
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
