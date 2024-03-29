# Rendition

[![npm version](https://img.shields.io/npm/v/rendition)](https://img.shields.io/npm/v/rendition)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/rendition)](https://img.shields.io/librariesio/release/npm/rendition)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

A library of UI components, built using [React][react], [styled-components][styled-components] and [styled-system][styled-system].

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Components](#components)
* [Development](#development)
* [Testing](#testing)
* [Upgrading](#testing)

## Installation

```
npm install --save rendition
```

## Usage

Wrap your application in the `Provider` component and start using components!

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Box, Provider } from 'rendition';

ReactDOM.render(
  <Provider>
    <Box my={3} mx={['auto', 15]}>
      <Button primary emphasized>Click me</Button>
    </Box>
  </Provider>,
  document.getElementById('root')
);
```

## Components

For an interactive demo of all components, see https://balena-io-modules.github.io/rendition

### Provider

Wrap your application in the `<Provider>` component so that child components can correctly inherit the default theme. You can optionally provide your own theme.

### Accessing the theme object

You can access the theme object in `<Provider>`'s descendant components using the `useTheme` hook:

```jsx
import React from 'react'
import { useTheme } from 'rendition';

const MyComponent = () => {
  const theme = useTheme()

  // ...
}
```

### Styled system

All components support [styled-system][styled-system] attributes, allowing you to use a shorthand properties for styling components. The properties can have the properties in the form of `string | number | Array<string | number>`. If an array is provided, then a property is chosen based on the width of the screen. The screen width corresponds to a breakpoint set in the `theme` property of the `Provider` component, by default this is set to `[32, 48, 64, 80]` where each number is the screen width in ems.

| Name          | Type              | Description                                  |
| --------------|-------------------|--------------------------------------------- |
|	width         | `ResponsiveStyle` | sets the width
|	minWidth      | `ResponsiveStyle` | sets the min-width
|	maxWidth      | `ResponsiveStyle` | sets the max-width
|	height        | `ResponsiveStyle` | sets the height
|	minHeight     | `ResponsiveStyle` | sets the min-height
|	maxHeight     | `ResponsiveStyle` | sets the max-height
|	fontSize      | `ResponsiveStyle` | sets the font size
|	display       | `ResponsiveStyle` | sets the `display` css property
|	color         | `ResponsiveStyle` | sets the `color` css property
|	bg            | `ResponsiveStyle` | sets the `background` css property
|	m             | `ResponsiveStyle` | sets the `margin` css property
|	mt            | `ResponsiveStyle` | sets the `margin-top` css property
|	mr            | `ResponsiveStyle` | sets the `margin-right` css property
|	mb            | `ResponsiveStyle` | sets the `margin-bottom` css property
|	ml            | `ResponsiveStyle` | sets the `margin-bottom` css property
|	mx            | `ResponsiveStyle` | sets both the `margin-right` and `margin-left` css properties
|	my            | `ResponsiveStyle` | sets both the `margin-top` and `margin-bottom` css properties
|	p             | `ResponsiveStyle` | sets the `padding` css property
|	pt            | `ResponsiveStyle` | sets the `padding-top` css property
|	pr            | `ResponsiveStyle` | sets the `padding-right` css property
|	pb            | `ResponsiveStyle` | sets the `padding-bottom` css property
|	pl            | `ResponsiveStyle` | sets the `padding-left` css property
|	px            | `ResponsiveStyle` | sets both the `padding-right` and `padding-left` css properties
|	py            | `ResponsiveStyle` | sets both the `padding-top` and `padding-bottom` css properties

&ast;*`ResponsiveStyle` corresponds to a type of `string | number | Array<string | number>`*

## Extra components

Some components in the [storybook](https://balena-io-modules.github.io/rendition)
are grouped separately under the `Extra` label. These components are not loaded by default 
as they rely on other large packages that you may not want to include in your 
application.
If you would like to use them they can be loaded using by prefixing the
component name with `rendition/dist/extra/`. For example to load the `Markdown`
components you can use:

```
import { Markdown } from 'rendition/dist/extra/Markdown';
```

## Contributing

Please read our [contribution guidelines](docs/CONTRIBUTING.md)

[react]:https://reactjs.org/
[styled-components]:https://www.styled-components.com/
[styled-system]:http://jxnblk.com/styled-system/
