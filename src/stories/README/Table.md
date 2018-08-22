# Table

A component used to generate a styled table.

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Table.js)

## Columns

The `columns` property defines what columns the table should display, how they
are rendered and whether or not the column is sortable.

The `columns` property should be an array of objects with the following properties:

| Name          | Type      | Required | Description                                          |
| -------------------------------------------------------------------------------- |
| field         | `keyof T`  | ✓ | The name of the field this column should render, this should correspond to a key on the objects passed to the `data` property of the `Table` component |
| cellAttributes | <code>object &#124; (value: any, row: T) => object</code> | - | Attributes that are passed to each cell in this column. This can also be a function, which will be called with the value of the `field` provided and the row data (`T`) |
| label | <code>string &#124; JSX.Element</code> | - | A string or JSX element that will be used to display the name of the column. If this property is not provided, the `field` property will be used instead |
| render | <code>(value: any, row: T) => string &#124; number &#124; number &#124; JSX.Element &#124; null</code> | - | Use a custom render function to display the value in each column cell. This function will be called with the value of the `field` provided and the row data (`T`) |
| sortable | <code>boolean &#124; (a: T, b: T) => number</code> | - | If true, the column will be sortable using an alphanumeric sort, alternatively a function can be provided allowing finer grained control over sorting |

## Notes

For performance reasons table rows are only re-rendered if the row properties
have changed. For this reason, rows **will not** re-render if their properties
are mutated: you should clone the item instead, for example:

```js
update (index) {
  const newData = this.state.data
  const element = newData[index]
  newData[index] = Object.assign({}, element, { active: !element.active })
  this.setState({ data: newData })
}
```

See the **Updating data in a table** story for an example of how this can be
done using a high order component.

Additionally, because of this rendering behaviour the `render()` functions in
the `Table` component's `columns` property should only use values provided to 
the render function.
When `render()` functions are provided, they must act like pure functions with 
respect to their props. They should only rely on their arguments to generate 
their output and not use any context variables. If you are using a context 
variable in your `render()` function, then changes to that variable will not 
cause a re-render of the component and will not be reflected on the table.

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `columns`    | `object[]` | - | ✓ | An array of column objects, as described above |
| `data`    | `T[]` | - | ✓ | An array of objects that will be displayed in the table |
| `getRowHeref`    | `(row: T) => string` | - | - | If provided, each row in the table will be a clickable link, this function is used to create the link href |
| `onCheck`    | `(checkedItems: T[]) => string` | - | - | If provided, each row will begin with a checkbox. This function is called with every checked row every time a checkbox is toggled on or off. This property requires that you have provided a `rowKey` property |
| `onRowClick`    | `(row: T, event: Event) => void` | - | - | A function that is called when a row is clicked. This property requires that you have provided a `rowKey` property |
| `rowAnchorAttributes`    | `object` | - | - | Attributes to pass to the anchor element used in a row |
| `rowCheckboxAttributes`    | `object` | - | - | Attributes to pass to the checkbox element used in a row |
| `rowKey`    | `key of T` | - | - | A field on a row that contains a unique identifier, can help speed up render performance and is required for the `onCheck` property |
| `toBodyPrefix`    | <code>JSX.element &#124; JSX.Element</code> | - | - | JSX element(s) to display at the top of the table body |
| `highlightedRows`    | <code>&ast;[]</code> | - | - | Highlights one or more rows. This property requires that you have provided a `rowKey` property: the row with a `rowKey` property that matches one of these values is highlighted. 

## Programmatically selecting rows

The component has a `setRowSelection` method that can be accesssed via <a href='https://reactjs.org/docs/refs-and-the-dom.html' target='_blank' rel='noopener'>ref</a>.

It will accept an array of rows `T[]`, or an empty array in order to clear the selection.

This method requires that you have provided a `rowKey` property.
