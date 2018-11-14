# Alert

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Alert.js)

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
| `emphasized`  | `boolean` | - | - | If true, use the use bolder colors and a larger size |
| `plaintText` | `boolean` | - | - | If true, the alert will be rendered without a border or a background |
| `prefix` | <code>JSX.Element &#124; string &#124; false</code> | - | - | Set a prefix on the alert message, if this prop is set to false, the default prefix will not be shown |
| `onDismiss` | `() => void` | - | - | A function that is called when dismissing an alert
