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

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `columns`    | `object[]` | - | ✓ | An array of column objects, as described above |
| `data`    | `T[]` | - | ✓ | An array of objects that will be displayed in the table |
| `getRowHeref`    | `(row: T) => string` | - | - | If provided, each row in the table will be a clickable link, this function is used to create the link href |
| `onCheck`    | `(checkedItems: T[]) => string` | - | - | If provided, each row will begin with a checkbox. This function is called with every checked row every time a checkbox is toggled on or off. This property requires that you have provided a `rowKey` property |
| `onRowClick`    | `(row: T, event: Event) => void` | - | - | A function that is called when a row is clicked |
| `rowAnchorAttributes`    | `object` | - | - | Attributes to pass to the anchor element used in a row |
| `rowCheckboxAttributes`    | `object` | - | - | Attributes to pass to the checkbox element used in a row |
| `rowKey`    | `key of T` | - | - | A field on a row that contains a unique identifier, can help speed up render performance and is required for the `onCheck` property |
| `toBodyPrefix`    | <code>JSX.element &#124; JSX.Element</code> | - | - | JSX element(s) to display at the top of the table body |

