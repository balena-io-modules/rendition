# Gauge

Generate a "gauge" shaped chart with a color coded legend.
Gauges are generated using an array of data, where each item represents
a segment of the gauge. Each item should have the following properties:

| Name          | Type      | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| value         | `number`  | A numerical value for this segment                   |
| name          | `string`  | A descriptive name for this segment                  |
| color         | `string`  | A CSS color string to use for this segment           |

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Gauge.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `title`  | `string` | - | ✓ | Text displayed in the center of the gauge |
| `data`  | `object[]` | - | ✓ | An array of data as described above |
| `placeholderColor`  | `string` | - | - | A CSS color string to use as the gauge background |

