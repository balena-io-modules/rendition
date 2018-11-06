# ArcSlider

A slider input that is displayed as an arc. This component will scale in size to
fit it's container. A label can be added by placing a child element inside this
component.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/ArcSlider.js)

## Props

| Name          | Type      | Default   | Required   | Description                                                   |
| --------------|-----------|-----------|------------|-------------------------------------------------------------- |
| `onValueChange`    | `(value: number) => void` | - | - | A function that is called when the slider value changes, this will always be a value between 0 and 1 |
| `value`       | `number`  | -         | -          | A number between 0 and 1 that represents the progress         |
| `fillColor`   | `string`  | -         | -          | A CSS color string to use for the color of the "filled" part of the arc |
| `background`  | `string`  | -         | -          | A CSS color string to use for the color of the arc track      |

## Inheritance

The properties of the [`Box`][1] component are also available.

[1]: /?selectedKind=Box
