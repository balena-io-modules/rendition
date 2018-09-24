# Textarea

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Textarea.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `monospace`  | `boolean` | `false` | - | If true, render text in a monospace font |
| `autoRows`  | `boolean` | `false` | - | If true, the textarea `rows` property will be changed automatically based on the content of the textarea, this behaviour will only work with a [controlled input][2] (i.e. you have used the `onChange` property |
| `minRows`  | `number` | - | - | Set the minimum number of rows |
| `maxRows`  | `number` | - | - | Set the maximum number of rows |
| `onChange`  | `(e: Event) => void` | - | - | A function that is called when the textarea value changes |

## Inheritance

The attributes of a [`<textarea>`][1] element are also available.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
[2]: https://reactjs.org/docs/forms.html#controlled-components


