/* eslint-disable no-unused-vars */
// Define theme

// Examples
//  - https://developer.microsoft.com/en-us/fluentui/#/styles/web/colors/products

// States: hover, focus, disabled
// Variation: emphasized, de-emphasized

// Contrast of outline color
// Contrast of focus color

// Editing the source files for button, card and tooltips to
// support the new theme set and use helper functions to generate
// appropriate colors, states and variations.

// From a limited base colorset, the variations should be generated.
// Could also be described as product colors.
const theme = {
  background: 'white',
  text: 'darkblue',
  primary: '#324234',
  secondary: '#aaff99' // Completely different from primary
}

// Story:
// Button with its variations (primary, secondary, etc)
// Button with its variations in a card (primary, secondary, etc)
// Button with its variations with tooltip (primary, secondary, etc)

// Contrast of text  vs the background (style + colors)
const Button = {
  states: {
    default: {
      text: 'white',
      background: 'blue',
      border: 'dark blue'
      // shadow
      // outline
      // highcontrast
    },
    hover: {
      text: 'white',
      background: 'blue',
      border: 'dark blue'
    },
    focus: {
      text: 'white',
      background: 'blue',
      border: 'dark blue'
    },
    disabled: {
      text: 'white',
      background: 'blue',
      border: 'dark blue'
    }
  }
}

// Colors used as the theme
//  - Background
//  - Text
//  - Buttons
//  - Component background
//  - Borders
// --------
//  - Badges component (16 colors)
//  - Terminal theme
//  - Markdown codeblocks
//  - Balena vscode IDE theme
//  - Mermaid flowchat component
// --------
//  - Alerts / Warnings
//     - Warning
//     - Danger
//     - Success
//     - Info
// -------- Product Colors
//  - Navbar (in balena dashboard)
//  - Etcher things
//  - Fin
//  - Jellyfish
//     - timeline events / messages
//     -
