# CodeWithCopy

Displays text formatted as `<code>` that can be copied to the clipboard.

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/CodeWithCopy.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `text`      | `string` | -         | ✓          | The value that should be displayed, if the `copy` prop is not provided, this value will be copied to the clipboard
| `copy`      | `string` | -         | -          | The value that should be copied to the clipboard
| `showCopyButton`      | <code>'hover' &#124; 'always'</code> | <code>'always'</code>       | -          | Optionally show the copy button on hover or always show the button
