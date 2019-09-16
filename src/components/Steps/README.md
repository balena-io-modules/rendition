# Steps

A visual guide showing a number of steps to be performed by the user. The `Steps` component takes one or more `Step` components as children.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Steps/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `children`    | `Step` | - | - | If true, uses a light colorscheme for use on a dark background |
| `titleText`    | `string` | -         | -          | If passed, the steps will have a title at the beginning |
| `titleIcon`    | `ReactNode` | -         | -          | If passed, an icon will be shown next to the title text, or on its own if there is no title text passed|
| `onClose`    | `() => void` | -         | ✓          | Function that is called when a user clicks on the close button, if not passed, no close button will be rendered |

### Step Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `children`    | `string` | - | - | The text of the step |
| `status`    | `'pending' | 'completed'` | -         | -          | Whether the step has been completed or is still pending|
| `onClick`    | () => void | -         | -          | If passed, the step will be clickable |