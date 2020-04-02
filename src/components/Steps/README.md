# Steps

A visual guide showing a number of steps to be performed by the user. The `Steps` component takes one or more `Step` components as children.

If the `ordered` prop is `true`, the steps will be considered as an ordered (numbered) list. In this case, the `activeStepIndex` must be set and the `onClick` callback prop of the child `Step` components used to update the `activeStepIndex`.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Steps/story.js)

## Props

| Name          | Type          | Default   | Required   | Description |
| ------------- | ------------- | --------- | ---------- | ----------- |
| `children`    | `Array<Step>` | -         | -          | The step components that form this sequence of steps |
| `titleText`   | `string`      | -         | -          | If passed, the steps will have a title at the beginning |
| `titleIcon`   | `ReactNode`   | -         | -          | If passed, an icon will be shown next to the title text, or on its own if there is no title text passed |
| `onClose`     | `() => void`  | -         | -          | Function that is called when a user clicks on the close button, if not passed, no close button will be rendered |
| `bordered`    | `boolean`     | `true`    | -           | If true (default), the steps container will have a visible border | 
| `ordered`     | `boolean`     | `false`   | -           | If true, the steps will be treated as an ordered list. Instead of the check icon, pending ordered steps will be displayed with a grey step number and active ordered steps with a blue step number.
| `activeStepIndex` | `number`  | -         | -           | If passed, specifies the step that is currently active. Only use with the `ordered` prop |

### Step Props

| Name       | Type                               | Default | Required   | Description |
| ---------- | ---------------------------------- | ------- | ---------- | ----------- |
| `children` | `string`                           | -       | ✓          | The text of the step |
| `status`   | `'pending' | 'completed' | 'none'` | -       | ✓          | Whether the step has been completed or is still pending |
| `onClick`  | () => void                         | -       | -          | If passed, the step will be clickable. _Note: If the steps are ordered, this callback should be used to update the `activeStepIndex` prop passed to the `Steps` component._  |
