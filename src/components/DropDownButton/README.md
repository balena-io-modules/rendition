# DropDownButton

Displays a button with an attached dropdown list, `children` of the component
are rendered inside a dropdown list.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/DropDownButton/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------------- | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | -         | -          | If true, use the `primary` theme color               |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color             |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color              |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color           |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color               |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color               |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                  |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `square`      | `boolean` | -         | -          | If true, render the button with equal length width and height |
| `disabled`      | `boolean` | -         | -          | If true, disabled the button |
| `label`      | `JSX.Element` | -         | -          | Optionally provide a JSX element that will be displayed inside the main button |
| `border`      | `boolean` | -         | -          | If true, place a border between each item in the dropdown |
| `joined`      | `boolean` | -         | -          | If true, render the component as a single button instead of two |
| `noListFormat`      | `boolean` | -         | -          | If true, render children as a single JSX element instead of iterating over each of them |
| `alignRight`      | `boolean` | -         | -          | If true, put the dropdown list on the right  |
| `listMaxHeight`      | `string \| number` | -         | -          | If setted, it defines the maximum height of the dropdown list |

