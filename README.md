# Rendition

[![npm version](https://badge.fury.io/js/rendition.svg)](http://badge.fury.io/js/rendition)
[![Build Status](https://travis-ci.org/resin-io-modules/rendition.svg?branch=master)](https://travis-ci.org/resin-io-modules/rendition)
[![Dependency Status](https://img.shields.io/david/resin-io-modules/rendition.svg)](https://david-dm.org/resin-io-modules/rendition)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

A library of UI components, built using [React][react], [recompose][recompose], [styled-components][styled-components] and [styled-system][styled-system].

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

### Components

For an interactive demo of all components, see https://resin-io-modules.github.io/rendition

Each component has its own README file that can be seen at the bottom of it's page.

#### Core

- [Alert](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FAlert)
- [Badge](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FBadge)
- [BadgeSelect](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FBadgeSelect)
- [Banner](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FBanner)
- [Button](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FButton)
- [Box](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FBox)
- [Card](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FCard)
- [CodeWithCopy](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FCodeWithCopy)
- [Container](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FContainer)
- [Divider](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FDivider)
- [DropDownButton](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FDropDownButtons)
- [Filters](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FFilters)
- [Fixed](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FFixed)
- [Flex](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FFlex)
- [Gauge](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FGauge)
- [Img](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FImg)
- [Input](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FInput)
- [Modal](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FModal)
- [NavBar](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FNavBar)
- [ProgressBar](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FProgessBar)
- [Search](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FSearch)
- [Select](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FSelect)
- [Table](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTable)
- [Terminal](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTerminal)
- [TextWithCopy](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTextWithCopy)
- [Textarea](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTextarea)
- [Tooltip](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTooltip)

#### Typography

- [Heading](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FHeading)
- [Link](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FLink)
- [Txt](https://resin-io-modules.github.io/rendition/?selectedKind=Core%2FTxt)

#### Beta

- [Form](https://resin-io-modules.github.io/rendition/?selectedKind=Beta%2FForm)

#### Extra

- [Markdown](https://resin-io-modules.github.io/rendition/?selectedKind=Extra%2FMarkdown)
- [Mermaid](https://resin-io-modules.github.io/rendition/?selectedKind=Extra%2FMermaid)


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

Some components in the [storybook](https://resin-io-modules.github.io/rendition)
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

Some components in the [storybook](https://resin-io-modules.github.io/rendition)
are grouped seperately under the `Beta` label. These components are experimental and still
under development, as such their API may change without notice. They should not 
be used in a production application.
If you would like to try them out they can be loaded using
`import * from 'rendition/dist/unstable'`.


## Developing

Clone this repository and then run:

```sh
npm ci
```

The interactive storybook can be launched by running:

```sh
npm run storybook
```

Code is automatically linted and formatted by [Husky][husky] as a pre-commit hook.

The interactive storybook can be published by running:

```sh
npm run publish-storybook
```

## Testing

```sh
npm test
```

## Upgrading

[Upgrading from 3.x to 4.x](docs/migrating_3x-4x.md)

[react]:https://reactjs.org/
[recompose]:https://github.com/acdlite/recompose
[styled-components]:https://www.styled-components.com/
[styled-system]:http://jxnblk.com/styled-system/
[husky]:https://github.com/typicode/husky
