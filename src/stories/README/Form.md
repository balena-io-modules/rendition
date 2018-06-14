# Form

A component that can be used for generating a form from a [json schema](http://json-schema.org/) object. 
The standard json schema types are supported, as well as the `date-time` format.

Under the hood, this component uses [`react-jsonschema-form`][2] and support
all [`uiSchema`][3] options from that project.

Additional formats are supported, but require supporting widgets to be loaded.
For example if you would like to support the [mermaid][1] format, you'll need to
import the widget using `import 'renditon/dist/extra/Form/mermaid'`.
This import only needs to happen once, so it is recommended that its done at the
root level of your application.

This component is experimental and still under development, if you would like to
use it, it can be imported using `import { Form } from 'rendition/dist/unstable'`.

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `schema`    | `object` | - | ✓ | A json schema describing the shape of the data you would like to gather |
| `submitButtonText` | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to replace the text in the form submit button |
| `hideSubmitButton` | `boolean` | - | - | If true, do not display the form submit button |
| `submitButtonProps` | `object` | - | - | Properties that are passed to the submit button, these are the same props used for the [`Button`][4] component |
| `value` | `*` | - | - | The data that should be displayed in the form |
| `onFormChange` | `(result: object) => void` | - | - | A function that is called when form data changes |
| `onFormSubmit` | `(result: object) => void` | - | - | A function that is called when the form is submitted |
| `uiSchema` | `object` | - | - | A configuration object used to change the styling and layout of the form. See the [`react-jsonschema-form`][3] docs for more details |


[1]: https://mermaidjs.github.io/
[2]: https://github.com/mozilla-services/react-jsonschema-form
[3]: https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object
[4]: /?selectedKind=Button
