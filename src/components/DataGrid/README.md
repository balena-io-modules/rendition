# DataGrid

A component that renders the data in a grid layout, usually using a card per item. For the best results, and in order to avoid large gaps between grid items, make sure your card item is responsive, and can handle double the minimum width (You should set `itemMaxWidth={itemMinWidth * 2}`).
[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Grid/story.js)

## Props

| Name           | Type                           | Default | Required | Description                                                  |
| -------------- | ------------------------------ | ------- | -------- | ------------------------------------------------------------ |
| `items`        | `T[]`                          | -       | ✓        | An array of data items that will be displayed in the grid    |
| `renderItem`   | `(item: T) => React.ReactNode` | -       | ✓        | A function that returns a react node to render for each item |
| `getItemKey`   | `(item: T) => string           | number` | -        | ✓                                                            | A function that returns a unique key per data item |
| `itemMinWidth` | `string`                       | -       | ✓        | The minimum width of each grid item                          |
| `itemMaxWidth` | `string`                       | -       | -        | The maximum width of each grid item                          |
