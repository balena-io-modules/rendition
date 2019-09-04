# ProgressBar

Displays a progress bar using a value representing a percentage.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/ProgressBar/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                                   |
| --------------|-----------|-----------|------------|-------------------------------------------------------------- |
| `primary`     | `boolean` | `true`    | -          | If true, use the `primary` theme color                        |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color                      |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color                       |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color                    |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                         |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color                        |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color                        |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                           |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                                    |
| `value`       | `number`  | -         | ✓          | A value between 1 and 100 that represents the progress        |
|  background   | `string`  | -         | -          | A CSS color string to use for the progress bar                |
|  color        | `string`  | -         | -          | A CSS color string to use for the content of the progress bar |
