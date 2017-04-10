# Resin Component

[![Build Status](https://travis-ci.org/resin-io-modules/resin-components.svg?branch=master)](https://travis-ci.org/resin-io-modules/resin-components)

Collection of resin.io react components and a library of shared less
variables and styles.

### Usage

Using webpack, you can import the styles using:

```js
@import "~resin-components/main.less";
```

You can import the react component you want directly into your project:

```js
import React from 'react';
import ResinInput from 'resin-components/Input';

const Example = () => {
  return (
    <div className="example-text-input">
      <Input type="text"></Input>
    </div>
  )
};

export default Example;
```

### Developing

Clone this repository and then run:

```sh
npm install
```

The interactive storybook can be launched by running:

```
npm run storybook
```

### Testing
```
npm test
```

If some snapshots fail make sure you have changed stories for those shots.
```
npm run new-snaps
```

### Publishing

```
npm run publish-storybook
```
