# Badge

By default the background color of a `Badge` component is generated
automatically from its `text` property, though this can be overridden.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Badge.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | - | - | If true, use the `primary` theme color     |
| `secondary`   | `boolean` | - | - | If true, use the `secondary` theme color   |
| `tertiary`    | `boolean` | - | - | If true, use the `tertiary` theme color    |
| `quarternary` | `boolean` | - | - | If true, use the `quarternary` theme color |
| `danger`      | `boolean` | - | - | If true, use the `danger` theme color      |
| `warning`     | `boolean` | - | - | If true, use the `warning` theme color     |
| `success`     | `boolean` | - | - | If true, use the `success` theme color     |
| `info`        | `boolean` | - | - | If true, use the `info` theme color        |
| `text`  | `string` | - | ✓ | The text to display inside the badge |
| `small`  | `boolean` | - | - | If true, reduce the scale of the badge |
