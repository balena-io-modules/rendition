# HighlightedName

By default the background color of a `HighlightedName` component is generated
automatically from its `children` (which must be a string), though this can be overridden.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/HighlightedName/story.js)

## Props

| Name       | Type     | Default                             | Required | Description                                         |
|------------|----------|-------------------------------------|----------|-----------------------------------------------------|
| `children` | `string` | -                                   | ✓        | The text to display inside the highlighted name     |
| `bg`       | `string` | generated from `children`           | -        | Background color generated from the `children` text |
| `color`    | `string` | `theme.colors.text.main` or `white` | -        | Generated depending on if the background is light   |
