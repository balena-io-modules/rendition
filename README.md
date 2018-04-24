# Rendition

[![npm version](https://badge.fury.io/js/rendition.svg)](http://badge.fury.io/js/rendition)
[![Build Status](https://travis-ci.org/resin-io-modules/rendition.svg?branch=master)](https://travis-ci.org/resin-io-modules/rendition)
[![Dependency Status](https://img.shields.io/david/resin-io-modules/rendition.svg)](https://david-dm.org/resin-io-modules/rendition)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

A library of UI components, built using [React][react], [recompose][recompose], [styled-components][styled-components] and [styled-system][styled-system].

## Usage

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

### Demo

For an interactive demo of all components, see https://resin-io-modules.github.io/rendition

### Provider

Wrap your application in the `<Provider>` component so that child components can correctly inherit the default theme. You can optionally provide your own theme.

### Styled system

All components support [styled-system][styled-system] attributes, allowing you to use `fontSize`, `color`, `px` etc.

## Unstable/Beta components

Some components in the [storybook](https://resin-io-modules.github.io/rendition)
are marked with a `[beta]` label. These components are experimental and still
under development, as such their API may change without notice. They should not 
be used in a production application.
If you would like to try them out they can be loaded using
`require('rendition/dist/unstable')`.

## Developing

Clone this repository and then run:

```sh
npm install
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
