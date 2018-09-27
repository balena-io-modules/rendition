# Toggle

Displays a toggle switch. 

If neither the `activeBg` prop nor a theme is provided, the default 'active' background color `#86d993` is applied. 

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `activeBg`| `string`  | -         | -          | The background color of the toggle when switched on. It takes the precedence over the theme color                     |
| `primary`     | `boolean` | -         | -          | If true, use the `primary` theme color               |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color             |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color              |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color           |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color               |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color               |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                  |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `on`  | `boolean`  | -         | -          | The state of the toggle switch        |
| `onToggle`    | `() => void` | -         | -          | Callback invoked when the "toggle" is switched, it gets passed the swith's state |