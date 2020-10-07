# JsonSchemaRenderer

A component used to render JSON data based on a schema and a UI schema. 

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/JsonSchemaRenderer/story.js)

## Props

| Name       | Type     | Default | Required | Description   |
| -----------|----------|---------|----------|-------------- |
| `value`    | `*`      | -       | -        | The data that should be rendered |
| `schema`   | `object` | -       | ✓        | A json schema describing the shape of the data you would like to render |
| `uiSchema` | `object` | -       | -        | A configuration object used to change the styling and layout of the rendered data.| 
| `extraFormats` | `[Format]` | - | - | An optional array of formats to pass to the validator, and an optional custom widget for the format. See [addFormat](https://github.com/ajv-validator/ajv#api-addformat) for details of formatters. |
| `extraContext` | `object` | - | - | Extra context used by `json-e` when transforming the UI schema. |
| `validate` | `boolean` | - | - | If set, the `value` will be validated against the `schema` and any error will be displayed at the top of the rendered output. Useful for debugging. |
