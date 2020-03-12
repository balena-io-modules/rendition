# Spinner

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Spinner/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `children`     | `React.ReactNode` |         | -          | If the spinner has children, it will show an opaque overlay over the children when it is spinning |
| `show`         | `boolean`         | true    | -          | If passed, it will control whether the spinner is shown or not |
| `emphasized`   | `boolean`         | false   | -          | If true, it will render a large spinner |
| `label`        | `string`          |         | -          | A label that will be rendered next to the spinner. Renders on right-hand side for standard spinner, and below spinner for emphasized |