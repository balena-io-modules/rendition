# Textarea

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Textarea/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `monospace`  | `boolean` | `false` | - | If true, render text in a monospace font |
| `autoRows`  | `boolean` | `false` | - | If true, the textarea `rows` property will be changed automatically based on the content of the textarea, this behaviour will only work with a [controlled input](https://reactjs.org/docs/forms.html#controlled-components) (i.e. you have used the `onChange` property |
| `minRows`  | `number` | - | - | Set the minimum number of rows |
| `maxRows`  | `number` | - | - | Set the maximum number of rows |
| `onChange`  | `(e: Event) => void` | - | - | A function that is called when the textarea value changes |

## Inheritance

The attributes of a [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) element are also available.

