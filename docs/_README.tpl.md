# Rendition

[![npm version](https://badge.fury.io/js/rendition.svg)](http://badge.fury.io/js/rendition)
[![Build Status](https://travis-ci.org/balena-io-modules/rendition.svg?branch=master)](https://travis-ci.org/balena-io-modules/rendition)
[![Dependency Status](https://img.shields.io/david/balena-io-modules/rendition.svg)](https://david-dm.org/balena-io-modules/rendition)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

A library of UI components, built using [React][react], [recompose][recompose], [styled-components][styled-components] and [styled-system][styled-system].

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

{% COMPONENT_DOCS %}

### Provider

Wrap your application in the `<Provider>` component so that child components can correctly inherit the default theme. You can optionally provide your own theme.

### Styled system

All components support [styled-system][styled-system] attributes, allowing you to use a shorthand properties for styling components. The properties can have the properties in the form of `string | number | Array<string | number>`. If an array is provided, then a property is chosen based on the width of the screen. The screen width corresponds to a breakpoint set in the `theme` property of the `Provider` component, by default this is set to `[32, 48, 64, 80]` where each number is the screen width in ems.

| Name          | Type              | Description                                  |
| --------------|-------------------|--------------------------------------------- |
|	w             | `ResponsiveStyle` | sets the width
|	fontSize      | `ResponsiveStyle` | sets the font size
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

## Unstable/Beta components

Some components in the [storybook](https://balena-io-modules.github.io/rendition)
are grouped seperately under the `Beta` label. These components are experimental and still
under development, as such their API may change without notice. They should not 
be used in a production application.
If you would like to try them out they can be loaded using
`import * from 'rendition/dist/unstable'`.

## Upgrading

[Upgrading from 3.x to 4.x](docs/migrating_3x-4x.md)

## Contributing

Please read our [contribution guidelines](docs/CONTRIBUTING.md)

[react]:https://reactjs.org/
[recompose]:https://github.com/acdlite/recompose
[styled-components]:https://www.styled-components.com/
[styled-system]:http://jxnblk.com/styled-system/
[husky]:https://github.com/typicode/husky
