# Flex

Displays an element using [flexbox][1].

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Flex.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `align`      | <code>string &#124; string[]</code> | - | - | Sets `align-items`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `justify`      | <code>string &#124; string[]</code> | - | - | Sets `justify-content`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `flexDirection`      | <code>string &#124; string[]</code> | - | - | Sets `flex-direction`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `wrap`      | <code>string &#124; string[]</code> | - | - | Sets `flex-wrap: wrap`

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox
