# Tag

Represents a name-value pair with an optional operator between.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Tag/story.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `value`     | `string` | - | - | The value part of the tag  |
| `operator`   | `boolean` | `':'` | - | The operator that goes between the name and value of the tag  |
| `name`    | `boolean` | - | - | The name part of the tag, if not provided, only the value will be shown  |
| `multiple`    | `Array<{name?: string, value?: string, operator?: string, prefix?: string}>` | - | - | An array of name-value pairs, with an optional delimiter to be used between the previous and current tag entry |
| `onClose` | `() => void` | - | - | Callback method, that if passed, a "close" button will be added to the right-hand side of the tag|
| `onClick` | `() => void` | - | - | Callback method, that if passed, the tag will become clickable |
