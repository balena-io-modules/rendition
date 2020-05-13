# Modal

Displays a centrally position modal overlay. Children passed to this component
are rendered inside the modal.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Modal/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------|-----------|-----------|------------|----------------------------------------------------- |
| `title`       | `string`
 | - | - | A title to display at the top of the Modal, only displayed if the `titleElement` property is not used |
| `titleElement`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display at the top of the modal |
| `titleDetails`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display underneath the modal's `title`, only displayed if the `titleElement` property is not used and a `title` property is provided |
| `action`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display in the primary modal button, defaults to 'OK' |
| `cancel`    | `() => any` | - | - | A function that is called if the modal is dismissed |
| `done`    | `() => any` | - | ✓ | A function that is called if the primary modal button is clicked |
| `primaryButtonProps` | `object` | - | - | Properties that are passed to the primary button, these are the same props used for the [`Button`](#button) component |
| `secondaryButtonProps` | `object` | - | - | If provided, will cause a secondary button to appear on the modal. These properties that are passed to that button, these are the same props used for the [`Button`](#button) component |
| `cancelButtonProps` | `object` | - | - | Properties that are passed to the cancel button, these are the same props used for the [`Button`](#button) component |
| style | `object` | - | - |  Apply custom styles to Modal, the object is applied as a [`style` attribute](https://reactjs.org/docs/dom-elements.html#style) |
| position | <code>'center' &#124; 'top'</code> | - | - | Start the modal from the center (default) or top |
