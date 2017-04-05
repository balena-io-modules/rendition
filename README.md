# Resin Component

Collection of resin.io react components and a library of shared less
variables and styles.

### Developing

Clone this repository and then run:

```sh
NODE_ENV=dev npm install
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

### General
- [ ] setup CI
- [ ] getting started/integration guide
- [ ] snapshot testing: https://getstorybook.io/docs/react-storybook/testing/structural-testing

### Storybook
- [ ] https://github.com/storybooks/storybook-addon-links
- [ ] https://github.com/storybooks/react-storybook-addon-info

### Styling
- [ ] add utils(like bourbon for js styles) https://polished.js.org/docs/
- [ ] add default theme eg https://github.com/callemall/material-ui/tree/master/src/styles/baseThemes
- [ ] typography (https://github.com/KyleAMathews/typography.js)

### Analytics
- [ ] best per project basis? some projects may not use react router.  

### Components list
- [ ] grid (flexbox?)
...
