# Rendition

[![npm version](https://badge.fury.io/js/rendition.svg)](http://badge.fury.io/js/rendition)
[![Build Status](https://travis-ci.org/resin-io-modules/rendition.svg?branch=master)](https://travis-ci.org/resin-io-modules/rendition)

A library of UI components, built using [React][react], [recompose][recompose], [styled-components][styled-components] and [styled-system][styled-system].

## Usage

You can import react components directly into your project:

```jsx
import React from 'react';
import { Button, Box } from 'rendition';

const Example = () => {
  return (
    <Box my={3} className="example-button-wrapper">
      <Button primary emphasized>Click me</Button>
    </Box>
  )
};

export default Example;
```

### Provider

Wrap your application in the `<Provider>` component so that child components can correctly inherit the default theme. You can optionally provide your own theme.

### Styled system

All components support [styled-system][styled-system] attributes, allowing you to use `fontSize`, `color`, `px` etc.

### UI Components

For an interactive demo of all components, see https://resin-io-modules.github.io/rendition

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

[react]:https://reactjs.org/
[recompose]:https://github.com/acdlite/recompose
[styled-components]:https://www.styled-components.com/
[styled-system]:http://jxnblk.com/styled-system/
[husky]:https://github.com/typicode/husky
