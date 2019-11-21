# Copy

Wrapper that adds a "copy to clipboard" button to any component and copies the passed content to the user's clipboard.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Copy/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `content`      | `string` | -         | ✓          | The value that should be copied to the clipboard
| `show`      | <code>'hover' &#124; 'always'</code> | - | - | Optionally show the copy button on hover or always show the button
| `children`      | `React.ReactNode` | -         | - | The content next to which the clipboard button should be shown
